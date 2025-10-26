#!/usr/bin/env python3
"""
AudioMate Backend API Server

REST API endpoints for script generation and speech synthesis.
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
from pathlib import Path
import traceback

from llm import ScriptGenerator
from speech_generator import ElevenLabsSpeechGenerator

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Initialize the speech generator
speech_generator = None

def init_speech_generator():
    """Initialize the speech generator with API key from environment."""
    global speech_generator
    api_key = os.getenv('ELEVENLABS_API_KEY')
    if not api_key:
        print("⚠️  Warning: ELEVENLABS_API_KEY not set. Speech generation will not work.")
        return
    speech_generator = ElevenLabsSpeechGenerator(api_key=api_key)


@app.route('/api/generate-script', methods=['POST'])
def generate_script():
    """
    Generate a script using LLM API.
    
    Request body should contain:
    - product_name: string
    - product_details: string
    - company_context: string
    - target_audience: string
    - distribution_method: string
    - desired_length: string (in seconds)
    - example_output: string
    - language: string
    
    Returns:
    - script: string (the generated script)
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = [
            'product_name', 'product_details', 'company_context', 
            'target_audience', 'distribution_method', 'desired_length',
            'example_output', 'language'
        ]
        
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                'error': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400
        
        # Create script generator with user inputs
        script_generator = ScriptGenerator(data)
        
        # Generate the script
        script = script_generator.generate_script()
        
        return jsonify({
            'script': script,
            'inputs': data
        }), 200
        
    except Exception as e:
        print(f"Error generating script: {e}")
        traceback.print_exc()
        return jsonify({
            'error': f'Failed to generate script: {str(e)}'
        }), 500


@app.route('/api/generate-speech', methods=['POST'])
def generate_speech():
    """
    Generate speech from script using ElevenLabs API.
    
    Request body should contain:
    - script: string (the script to convert to speech)
    - tone: string (e.g., "dramatic", "friendly", "professional", "casual", "calm")
    - gender: string ("male", "female", "neutral")
    - background_music: string (e.g., "electronic", "ambient", "upbeat", "classical", "acoustic", "none")
    - language: string (e.g., "english", "spanish", "french", etc.)
    
    Returns:
    - filename: string (the output filename)
    - filepath: string (relative path to the file)
    """
    try:
        if not speech_generator:
            return jsonify({
                'error': 'ElevenLabs API key not configured. Please set ELEVENLABS_API_KEY environment variable.'
            }), 500
        
        data = request.get_json()
        
        # Validate required fields
        if 'script' not in data:
            return jsonify({
                'error': 'Missing required field: script'
            }), 400
        
        script = data.get('script')
        tone = data.get('tone', 'professional')
        gender = data.get('gender', 'neutral')
        background_music = data.get('background_music', 'none')
        language = data.get('language', 'english')
        
        # Generate output filename
        output_file = ElevenLabsSpeechGenerator.generate_output_filename(
            tone=tone,
            gender=gender,
            language=language,
            background_music=background_music
        )
        
        # Generate speech
        speech_generator.generate_speech(
            script,
            output_file=output_file,
            tone=tone,
            gender=gender,
            background_music=background_music,
            language=language
        )
        
        # Extract relative path from absolute path
        filename = Path(output_file).name
        filepath = f"outputs/{filename}"
        
        return jsonify({
            'filename': filename,
            'filepath': filepath,
            'message': 'Speech generated successfully'
        }), 200
        
    except Exception as e:
        print(f"Error generating speech: {e}")
        traceback.print_exc()
        return jsonify({
            'error': f'Failed to generate speech: {str(e)}'
        }), 500


@app.route('/api/audio/<filename>', methods=['GET'])
def get_audio(filename):
    """
    Retrieve an audio file from the outputs directory.
    
    Parameters:
    - filename: string (the name of the audio file)
    
    Returns:
    - Audio file (MP3)
    """
    try:
        # Security check: prevent directory traversal
        if '..' in filename or '/' in filename or '\\' in filename:
            return jsonify({
                'error': 'Invalid filename'
            }), 400
        
        # Construct the file path
        file_path = Path('outputs') / filename
        
        # Check if file exists
        if not file_path.exists():
            return jsonify({
                'error': f'Audio file not found: {filename}'
            }), 404
        
        # Send the file
        return send_file(
            str(file_path),
            mimetype='audio/mpeg',
            as_attachment=False
        )
        
    except Exception as e:
        print(f"Error retrieving audio: {e}")
        traceback.print_exc()
        return jsonify({
            'error': f'Failed to retrieve audio: {str(e)}'
        }), 500


if __name__ == '__main__':
    # Create outputs directory if it doesn't exist
    Path('outputs').mkdir(exist_ok=True)
    
    # Initialize the speech generator
    init_speech_generator()
    
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5001)

