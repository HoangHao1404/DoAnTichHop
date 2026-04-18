from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
from PIL import Image
import numpy as np
import io
import base64
from pathlib import Path
import logging

app = Flask(__name__)
CORS(app)

# Resolve trained model path relative to this file and load safely
MODEL_PATH = Path(__file__).parent / 'best.pt'

# Configure logging
logging.basicConfig(level=logging.INFO)
model = None
try:
    if MODEL_PATH.exists():
        logging.info(f"Loading model from {MODEL_PATH}")
        model = YOLO(str(MODEL_PATH))
        logging.info("Model loaded successfully")
    else:
        logging.error(f"Model file not found at {MODEL_PATH}")
except Exception as e:
    logging.exception("Failed to load model:")

CLASS_NAMES = [
    'Road cracks', 'Pothole', 'Illegal Parking', 'Broken Road Sign',
    'Fallen trees', 'Littering', 'Graffitti', 'Dead Animal',
    'Damaged concrete', 'Damaged Electric wires'
]

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'}), 200

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Ensure model is available
        if model is None:
            return jsonify({'error': 'Model not loaded on server'}), 500
        # Get image from request
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Read and process image
        image = Image.open(io.BytesIO(file.read()))
        
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
                        'class_name': CLASS_NAMES[class_id],
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


@app.route('/', methods=['GET'])
def index():
    return jsonify({'status': 'ok', 'routes': ['/health','/predict (POST)','/classes']}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)