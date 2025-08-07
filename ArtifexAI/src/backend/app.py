"""
Artifex.AI Backend Server
Handles AI model integration and processing
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import asyncio
import os
import sys
import json
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

# Import AI model manager
try:
    from backend.ai_model_manager import ai_manager
except ImportError:
    print("Warning: AI model manager not available")
    ai_manager = None

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Configuration
app.config['SECRET_KEY'] = 'artifex-ai-secret-key'
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024 * 1024  # 5GB max file size

# API Routes
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Artifex.AI Backend',
        'version': '2.0.0'
    })

@app.route('/api/generate/video', methods=['POST'])
async def generate_video():
    """Generate video using AI models"""
    try:
        data = request.json
        prompt = data.get('prompt')
        provider = data.get('provider', 'runway_gen3')
        
        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400
        
        if ai_manager:
            result = await ai_manager.generate_video(
                prompt=prompt,
                provider=provider,
                duration=data.get('duration', 5),
                resolution=data.get('resolution', '1280x720')
            )
            return jsonify(result)
        else:
            # Mock response for development
            return jsonify({
                'url': 'http://example.com/video.mp4',
                'provider': provider,
                'cost': 0.05
            })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate/image', methods=['POST'])
async def generate_image():
    """Generate image using AI models"""
    try:
        data = request.json
        prompt = data.get('prompt')
        provider = data.get('provider', 'midjourney')
        
        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400
        
        if ai_manager:
            result = await ai_manager.generate_image(
                prompt=prompt,
                provider=provider,
                style=data.get('style')
            )
            return jsonify(result)
        else:
            # Mock response for development
            return jsonify({
                'urls': ['http://example.com/image1.jpg'],
                'provider': provider,
                'cost': 0.02
            })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate/audio', methods=['POST'])
async def generate_audio():
    """Generate audio/music using AI models"""
    try:
        data = request.json
        prompt = data.get('prompt')
        provider = data.get('provider', 'suno')
        
        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400
        
        if ai_manager:
            result = await ai_manager.generate_music(
                prompt=prompt,
                provider=provider,
                duration=data.get('duration', 60),
                genre=data.get('genre')
            )
            return jsonify(result)
        else:
            # Mock response for development
            return jsonify({
                'url': 'http://example.com/audio.mp3',
                'provider': provider,
                'cost': 0.08
            })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/projects', methods=['GET'])
def get_projects():
    """Get list of projects"""
    # Mock data for development
    return jsonify([
        {
            'id': '1',
            'name': 'Demo Project',
            'created': '2024-01-01',
            'modified': '2024-01-02',
            'thumbnail': 'http://example.com/thumb.jpg'
        }
    ])

@app.route('/api/project/<project_id>', methods=['GET'])
def get_project(project_id):
    """Get project details"""
    # Mock data for development
    return jsonify({
        'id': project_id,
        'name': 'Demo Project',
        'settings': {},
        'timeline': [],
        'nodes': []
    })

# WebSocket events
@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    print('Client connected')
    emit('connected', {'message': 'Connected to Artifex.AI server'})

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    print('Client disconnected')

@socketio.on('process_frame')
def handle_process_frame(data):
    """Process a video frame"""
    # Process frame and emit result
    emit('frame_processed', {
        'frame_id': data.get('frame_id'),
        'status': 'completed'
    })

@socketio.on('ai_request')
def handle_ai_request(data):
    """Handle AI processing request"""
    request_type = data.get('type')
    
    # Process based on request type
    if request_type == 'enhance':
        emit('ai_response', {
            'type': 'enhance',
            'status': 'processing',
            'progress': 0
        })
    elif request_type == 'generate':
        emit('ai_response', {
            'type': 'generate',
            'status': 'processing',
            'progress': 0
        })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting Artifex.AI backend server on port {port}")
    socketio.run(app, host='0.0.0.0', port=port, debug=True)