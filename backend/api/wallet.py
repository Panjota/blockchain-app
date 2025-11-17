from flask import jsonify

class Wallet:
    def __init__(self):
        self.balances = {}

    def create_account(self, user_id):
        if user_id not in self.balances:
            self.balances[user_id] = 0

    def get_balance(self, user_id):
        return self.balances.get(user_id, 0)

    def transfer(self, sender_id, recipient_id, amount):
        if sender_id not in self.balances or recipient_id not in self.balances:
            raise ValueError("Sender or recipient does not exist.")
        if self.balances[sender_id] < amount:
            raise ValueError("Insufficient funds.")
        
        self.balances[sender_id] -= amount
        self.balances[recipient_id] += amount
        return True

# Global wallet instance (kept for compatibility but not used)
wallet = Wallet()

# Import blockchain instance from main module
def get_blockchain():
    from main import blockchain
    return blockchain

def transfer_funds(sender, recipient, amount):
    """Transfer funds between users using blockchain"""
    try:
        # Validate inputs
        if not sender or not recipient or not amount:
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Convert amount to float
        try:
            amount = float(amount)
        except (ValueError, TypeError):
            return jsonify({'error': 'Invalid amount'}), 400
        
        # Check if amount is valid
        if amount <= 0:
            return jsonify({'error': 'Amount must be positive'}), 400
        
        # Check if sender is trying to send to themselves
        if sender == recipient:
            return jsonify({'error': 'Cannot send transaction to yourself'}), 400
        
        # Get blockchain instance
        blockchain = get_blockchain()
        
        # Attempt transfer through blockchain
        success, result = blockchain.add_transaction(sender, recipient, amount)
        
        if not success:
            return jsonify({'error': result}), 400
        
        return jsonify({
            'message': 'Transfer successful',
            'sender': sender,
            'recipient': recipient,
            'amount': amount,
            'sender_new_balance': blockchain.get_balance(sender),
            'recipient_new_balance': blockchain.get_balance(recipient),
            'block_index': result
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_user_balance(username):
    """Get user balance from blockchain"""
    try:
        blockchain = get_blockchain()
        balance = blockchain.get_balance(username)
        return jsonify({
            'username': username,
            'balance': balance
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_user_transaction_history(username):
    """Get user transaction history from blockchain"""
    try:
        blockchain = get_blockchain()
        
        # Get all transactions for the user from confirmed blocks
        user_transactions = []
        
        # Iterate through all blocks in the blockchain
        for block in blockchain.chain:
            # Skip genesis block (no transactions)
            if block.get('index', 0) == 1:  # Genesis block has index 1
                continue
                
            # Check transactions in each block
            transactions = block.get('transactions', [])
            for transaction in transactions:
                # Include transaction if user is sender or recipient
                if transaction.get('sender') == username or transaction.get('recipient') == username:
                    transaction_data = {
                        'hash': transaction.get('hash', f"tx_{block.get('index', 0)}_{len(user_transactions)}"),
                        'sender': transaction.get('sender', ''),
                        'recipient': transaction.get('recipient', ''),
                        'amount': transaction.get('amount', 0),
                        'timestamp': transaction.get('timestamp', block.get('timestamp', 0)),
                        'block_index': block.get('index', 0),
                        'block_hash': block.get('previous_hash', ''),
                        'type': 'sent' if transaction.get('sender') == username else 'received',
                        'status': 'confirmed'
                    }
                    user_transactions.append(transaction_data)
        
        # Sort transactions by timestamp (newest first)
        user_transactions.sort(key=lambda x: x['timestamp'], reverse=True)
        
        return jsonify({
            'username': username,
            'transactions': user_transactions,
            'total_transactions': len(user_transactions)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500