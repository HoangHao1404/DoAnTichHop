from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
from PIL import Image, UnidentifiedImageError
import io
import base64
from pathlib import Path

app = Flask(__name__)
CORS(app)

# Load the trained model
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / 'best.pt'
model = YOLO(str(MODEL_PATH))

CLASS_NAMES = [
    'Road cracks', 'Pothole', 'Illegal Parking', 'Broken Road Sign',
    'Fallen trees', 'Littering', 'Graffitti', 'Dead Animal',
    'Damaged concrete', 'Damaged Electric wires'
]


def _get_class_name(class_id: int) -> str:
    if 0 <= class_id < len(CLASS_NAMES):
        return CLASS_NAMES[class_id]
    model_names = getattr(model, 'names', None)
    if isinstance(model_names, dict):
        return model_names.get(class_id, f'class_{class_id}')
    if isinstance(model_names, list) and 0 <= class_id < len(model_names):
        return model_names[class_id]
    return f'class_{class_id}'


@app.route('/', methods=['GET'])
def index():
    return jsonify({
        'service': 'Urban Issues AI API',
        'endpoints': {
            'health': '/health',
            'predict': '/predict (POST multipart/form-data, field: image)',
            'classes': '/classes'
        }
    }), 200

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'}), 200

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get image from request
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Read and process image
        file_bytes = file.read()
        if not file_bytes:
            return jsonify({'error': 'Uploaded file is empty'}), 400

        try:
            image = Image.open(io.BytesIO(file_bytes)).convert('RGB')
        except UnidentifiedImageError:
            return jsonify({'error': 'Invalid image file'}), 400
        
        # Run inference
        results = model(image, conf=0.25)
        
        # Parse results
        detections = []
        for result in results:
            if result.boxes is not None:
                for i, box in enumerate(result.boxes):
                    class_id = int(box.cls.item())
                    confidence = float(box.conf.item())
                    
                    # Get coordinates
                    xyxy = box.xyxy[0].cpu().numpy()
                    
                    detections.append({
                        'class_id': class_id,
                        'class_name': _get_class_name(class_id),
                        'confidence': round(confidence, 4),
                        'bbox': {
                            'x_min': float(xyxy[0]),
                            'y_min': float(xyxy[1]),
                            'x_max': float(xyxy[2]),
                            'y_max': float(xyxy[3])
                        }
                    })
        
        # Annotate image
        annotated_img = results[0].plot()
        img_pil = Image.fromarray(annotated_img)
        
        # Convert to base64 for response
        buffered = io.BytesIO()
        img_pil.save(buffered, format='JPEG')
        img_base64 = base64.b64encode(buffered.getvalue()).decode()
        
        return jsonify({
            'success': True,
            'detections': detections,
            'image': f'data:image/jpeg;base64,{img_base64}',
            'total_objects': len(detections)
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/classes', methods=['GET'])
def get_classes():
    return jsonify({'classes': CLASS_NAMES}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)