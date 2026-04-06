from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import cv2
import numpy as np
from ultralytics import YOLO
import os
import base64

# Configurar carpetas
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(BACKEND_DIR)
FRONTEND_DIR = os.path.join(PARENT_DIR, "frontend")

app = Flask(
    __name__,
    static_folder=os.path.join(FRONTEND_DIR, "static"),
    template_folder=FRONTEND_DIR,
)
CORS(app)

# Configuracion
UPLOAD_FOLDER = os.path.join(BACKEND_DIR, "uploads")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "bmp"}
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = MAX_FILE_SIZE

# ==================== CARGAR MODELO ====================

model = None
model_path = None


def load_model():
    """Carga el mejor modelo disponible (prioriza Best Model.pt)."""
    global model, model_path

    try:
        candidate_paths = [
            os.path.join(PARENT_DIR, "Best Model.pt"),
            os.path.join(PARENT_DIR, "Yolo 26 Model.pt"),
            os.path.join(PARENT_DIR, "Yolov8n Segmentation.pt"),
            os.path.join(PARENT_DIR, "runs", "segment", "train", "weights", "best.pt"),
            os.path.join(PARENT_DIR, "results", "best.pt"),
            os.path.join(BACKEND_DIR, "runs", "segment", "train", "weights", "best.pt"),
            os.path.join(PARENT_DIR, "yolov8n-seg.pt"),
        ]

        for path in candidate_paths:
            if os.path.exists(path):
                print(f"Cargando modelo desde: {path}")
                model = YOLO(path)
                model_path = path
                print("Modelo cargado correctamente")
                return

        print("No se encontro ningun modelo .pt local. Intentando [yolov8n-seg.pt](http://_vscodecontentref_/1) por nombre...")
        model = YOLO("yolov8n-seg.pt")
        model_path = "yolov8n-seg.pt"
        print("Modelo cargado: yolov8n-seg.pt")

    except Exception as e:
        print(f"Error al cargar modelo: {e}")
        model = None
        model_path = None


# Cargar modelo al iniciar
load_model()


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def calculate_damage(masks, image_shape):
    """Calcula el porcentaje de dano total."""
    if masks is None or len(masks) == 0:
        return 0.0

    total_area = 0.0
    image_area = image_shape[0] * image_shape[1]

    for mask in masks:
        binary_mask = (mask > 0).astype(np.uint8) * 255
        contours, _ = cv2.findContours(binary_mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        if len(contours) > 0:
            contour = max(contours, key=cv2.contourArea)
            total_area += cv2.contourArea(contour)

    percentage_damage = (total_area / image_area) * 100 if image_area > 0 else 0.0
    return min(percentage_damage, 100.0)


def image_to_base64(image_array):
    """Convierte imagen numpy array a base64."""
    ok, buffer = cv2.imencode(".jpg", image_array)
    if not ok:
        return None
    img_base64 = base64.b64encode(buffer).decode("utf-8")
    return f"data:image/jpeg;base64,{img_base64}"


# ==================== RUTAS FRONTEND ====================

@app.route("/")
def index():
    """Pagina principal."""
    return render_template("index.html")


@app.route("/<path:path>")
def serve_static(path):
    """Serve static files."""
    file_path = os.path.join(FRONTEND_DIR, path)
    if os.path.isfile(file_path):
        return send_from_directory(FRONTEND_DIR, path)
    return render_template("index.html")


# ==================== RUTAS API ====================

@app.route("/api/health", methods=["GET"])
def health():
    """Endpoint de salud."""
    return jsonify(
        {
            "status": "ok",
            "model_loaded": model is not None,
            "model_path": model_path,
            "message": "Servidor activo",
        }
    )


@app.route("/api/predict", methods=["POST"])
def predict():
    """Endpoint principal de prediccion."""
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400

        if not allowed_file(file.filename):
            return jsonify({"error": "Invalid file type"}), 400

        if model is None:
            return jsonify({"error": "Model not loaded"}), 500

        image_data = file.read()
        nparr = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if image is None:
            return jsonify({"error": "Invalid image file"}), 400

        results = model.predict(source=image, conf=0.5, imgsz=640)
        result = results[0]
        annotated_image = result.plot()

        masks = None
        num_detections = 0
        detections_info = []

        if result.masks is not None:
            masks = result.masks.data.cpu().numpy()
            num_detections = len(masks)

        if result.boxes is not None and len(result.boxes) > 0:
            cls_list = result.boxes.cls.tolist()
            conf_list = result.boxes.conf.tolist()

            for cls_id, confidence in zip(cls_list, conf_list):
                detections_info.append(
                    {
                        "class": result.names[int(cls_id)],
                        "confidence": round(float(confidence), 3),
                    }
                )

        damage_percentage = calculate_damage(masks, image.shape)
        annotated_base64 = image_to_base64(annotated_image)

        if annotated_base64 is None:
            return jsonify({"error": "Could not encode output image"}), 500

        return jsonify(
            {
                "success": True,
                "image_base64": annotated_base64,
                "num_potholes": num_detections,
                "damage_percentage": round(damage_percentage, 2),
                "detections": detections_info,
                "status": "Prediction completed",
            }
        )

    except Exception as e:
        print(f"Error en prediccion: {e}")
        import traceback

        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/api/info", methods=["GET"])
def info():
    """Informacion del modelo."""
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    return jsonify(
        {
            "model_name": os.path.basename(model_path) if model_path else "unknown",
            "model_path": model_path,
            "task": "Instance Segmentation",
            "description": "Deteccion y segmentacion de potholes en carreteras",
            "backend_path": BACKEND_DIR,
            "frontend_path": FRONTEND_DIR,
        }
    )


if __name__ == "__main__":
    print("\n" + "=" * 70)
    print("YOLO Pothole Detection Server")
    print("=" * 70)
    print(f"Backend: {BACKEND_DIR}")
    print(f"Frontend: {FRONTEND_DIR}")
    print(f"Model: {'Loaded' if model else 'Not loaded'}")
    print(f"Model path: {model_path}")
    print("=" * 70)
    print("Accede a: http://127.0.0.1:5001")
    print("=" * 70 + "\n")

    app.run(debug=True, host="0.0.0.0", port=5001)