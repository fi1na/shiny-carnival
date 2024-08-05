from flask import Flask, request, jsonify, send_from_directory
import numpy as np
from PIL import Image
from io import BytesIO
from keras.models import load_model
from flask_cors import CORS
import logging
import os

app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
logging.basicConfig(level=logging.DEBUG)
model = load_model('DiabeticRetinopathy10Epochs.h5')
input_size = (224, 224)
class_labels = [0, 1]
CORS(app)


@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/predict', methods=['POST'])
def predict():
    try:
        file = request.files['image']
        img = Image.open(BytesIO(file.read()))

        img = img.convert('RGB')
        img = img.resize((224, 224))
        img_array = np.array(img)
        img_array = img_array / 255.0
        img = np.expand_dims(img_array, axis=0)
        print("Processed Image Shape:", img.shape)
        predictions = model.predict(img)
        predicted_class = class_labels[int(predictions[0][0])]
        result = {'prediction': predicted_class, "size": input_size}
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)})


if __name__ == '__main__':
    app.run(port=5000)
