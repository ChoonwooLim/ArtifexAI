"""
Simple redirect to the actual backend server
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.backend.app import app, socketio

if __name__ == '__main__':
    # Add allow_unsafe_werkzeug=True for development
    socketio.run(app, host='0.0.0.0', port=5000, debug=True, allow_unsafe_werkzeug=True)