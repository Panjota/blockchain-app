from flask import Flask, request, jsonify
from flask_cors import CORS
from blockchain.blockchain import Blockchain
from api.auth import register as register_user, login as login_user
from api.wallet import transfer_funds, get_user_balance, get_user_transaction_history

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
blockchain = Blockchain()

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    return register_user(username, password)

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    return login_user(username, password)

@app.route('/transfer', methods=['POST'])
def transfer():
    data = request.json
    sender = data.get('sender')
    recipient = data.get('recipient')
    amount = data.get('amount')
    return transfer_funds(sender, recipient, amount)

@app.route('/balance/<username>', methods=['GET'])
def get_balance(username):
    return get_user_balance(username)

@app.route('/transactions/<username>', methods=['GET'])
def get_transaction_history(username):
    return get_user_transaction_history(username)

@app.route('/network/stats', methods=['GET'])
def get_network_stats():
    """Get blockchain network statistics"""
    try:
        stats = blockchain.get_network_stats()
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/blockchain', methods=['GET'])
def get_blockchain():
    """Get the entire blockchain"""
    try:
        return jsonify({
            'chain': blockchain.chain,
            'length': len(blockchain.chain)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)