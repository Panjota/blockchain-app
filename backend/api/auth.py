from flask import Blueprint, request, jsonify
from database.storage import Storage as UserStorage
from utils.crypto import hash_password, verify_password

auth_bp = Blueprint('auth', __name__)
user_storage = UserStorage()

# Import blockchain instance from main module
def get_blockchain():
    from main import blockchain
    return blockchain

# Standalone functions for direct import
def register(username, password):
    """Register a new user"""
    try:
        if not username or not password:
            return jsonify({'error': 'Username and password are required'}), 400

        hashed_password = hash_password(password)
        
        # Check if user already exists
        if not user_storage.add_user(username, hashed_password):
            return jsonify({'error': 'Username already exists'}), 400
        
        # Create blockchain account with initial balance
        blockchain = get_blockchain()
        success, message = blockchain.create_user_account(username)
        
        if not success:
            # Remove user from storage if blockchain account creation failed
            user_storage.users.pop(username, None)
            return jsonify({'error': f'Account creation failed: {message}'}), 500
        
        return jsonify({
            'message': f'User registered successfully. {message}'
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def login(username, password):
    """Login user"""
    try:
        if not username or not password:
            return jsonify({'error': 'Username and password are required'}), 400

        if user_storage.validate_user(username, hash_password(password)):
            return jsonify({'message': 'Login successful'}), 200
        else:
            return jsonify({'error': 'Invalid username or password'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Blueprint routes (for future use if needed)
@auth_bp.route('/register', methods=['POST'])
def register_route():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    return register(username, password)

@auth_bp.route('/login', methods=['POST'])
def login_route():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    return login(username, password)