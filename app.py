import time
from flask import Flask, render_template, request, jsonify
import string
import logging
import psutil
from concurrent.futures import ProcessPoolExecutor
import random

# Configuración de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate_password():
    data = request.json
    
    # Validar y obtener la longitud de la contraseña
    try:
        total_length = int(data.get('length', 60))   # Longitud predeterminada: 60
    except ValueError:
        return jsonify({"error": "Invalid length."}), 400
    
    if total_length > 10_000_000:
        return jsonify({"error": "Maximum allowed length is 10 million characters."}), 400
        
    # Tipos de caracteres a incluir
    include_numbers = data.get('numbers', True)
    include_uppercase = data.get('uppercase', True)
    include_lowercase = data.get('lowercase', True)
    include_special = data.get('special', True)
    
    # Construcción del conjunto de caracteres
    characters = ""
    if include_numbers:
        characters += string.digits
    if include_uppercase:
        characters += string.ascii_uppercase
    if include_lowercase:
        characters += string.ascii_lowercase
    if include_special:
        characters += string.punctuation
    
    if not characters:
        return jsonify({"error": "Select at least one type of character."}), 400
        
    # Medir tiempo de inicio
    start_time = time.time()
    
    # Generación secuencial de contraseñas más eficiente para longitudes grandes
    password = ''.join(random.SystemRandom().choice(characters) for _ in range(total_length))
    
    # Medir tiempo de finalización
    elapsed_time = time.time() - start_time
    
    # Uso de CPU y RAM
    cpu_usage = psutil.cpu_percent(interval=0.1)
    ram_usage = psutil.virtual_memory().percent
    
    logger.info(f'Tiempo para generar contraseña: {elapsed_time:.6f} segundos')
    logger.info(f'Uso de CPU: {cpu_usage}%')
    logger.info(f'Uso de RAM: {ram_usage}%')
    
    return jsonify({"password": password, "time": f"{elapsed_time:.6f} seconds", 
                   "cpu_usage": f"{cpu_usage}%", "ram_usage": f"{ram_usage}%"})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
