import hashlib
import json
import os
from .token_economy import TokenEconomy

class Blockchain:
    def __init__(self):
        self.data_dir = "data"
        self.blockchain_file = os.path.join(self.data_dir, "blockchain.json")
        
        # Ensure data directory exists
        os.makedirs(self.data_dir, exist_ok=True)
        
        # Initialize token economy
        self.token_economy = TokenEconomy()
        
        # Load existing blockchain or create new
        self.chain, self.current_transactions = self.load_blockchain()
        
        # Create genesis block if chain is empty
        if not self.chain:
            self.create_block(previous_hash='1', proof=100)

    def load_blockchain(self):
        """Load blockchain from JSON file"""
        if os.path.exists(self.blockchain_file):
            try:
                with open(self.blockchain_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    chain = data.get('chain', [])
                    current_transactions = data.get('current_transactions', [])
                    return chain, current_transactions
            except (json.JSONDecodeError, FileNotFoundError):
                pass
        
        return [], []

    def save_blockchain(self):
        """Save blockchain to JSON file"""
        try:
            data = {
                'chain': self.chain,
                'current_transactions': self.current_transactions
            }
            with open(self.blockchain_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Error saving blockchain: {e}")

    def create_block(self, proof, previous_hash):
        block = {
            'index': len(self.chain) + 1,
            'timestamp': self.get_current_timestamp(),
            'transactions': self.current_transactions,
            'proof': proof,
            'previous_hash': previous_hash,
        }
        self.current_transactions = []
        self.chain.append(block)
        
        # Persist blockchain
        self.save_blockchain()
        
        return block

    def get_current_timestamp(self):
        from time import time
        return time()

    def add_transaction(self, sender, recipient, amount):
        """Add a validated transaction to the blockchain"""
        # Validate transaction through token economy
        success, message = self.token_economy.transfer_tokens(sender, recipient, amount)
        
        if not success:
            return False, message
        
        transaction = {
            'sender': sender,
            'recipient': recipient,
            'amount': amount,
            'timestamp': self.get_current_timestamp()
        }
        
        self.current_transactions.append(transaction)
        
        # Save current state
        self.save_blockchain()
        
        return True, self.last_block['index'] + 1

    def create_user_account(self, username):
        """Create a new user account with initial balance"""
        return self.token_economy.create_user_account(username)

    def get_balance(self, username):
        """Get user balance from token economy"""
        return self.token_economy.get_balance(username)

    def get_network_stats(self):
        """Get blockchain network statistics"""
        stats = self.token_economy.get_network_stats()
        stats.update({
            'total_blocks': len(self.chain),
            'pending_transactions': len(self.current_transactions),
            'total_transactions': sum(len(block['transactions']) for block in self.chain)
        })
        return stats

    @property
    def last_block(self):
        return self.chain[-1]

    def validate_chain(self):
        for i in range(1, len(self.chain)):
            block = self.chain[i]
            previous_block = self.chain[i - 1]

            if block['previous_hash'] != self.hash(previous_block):
                return False

            if not self.is_proof_valid(previous_block['proof'], block['proof']):
                return False
        return True

    def hash(self, block):
        block_string = str(block).encode()
        return hashlib.sha256(block_string).hexdigest()

    def is_proof_valid(self, last_proof, proof):
        guess = f'{last_proof}{proof}'.encode()
        guess_hash = hashlib.sha256(guess).hexdigest()
        return guess_hash[:4] == "0000"