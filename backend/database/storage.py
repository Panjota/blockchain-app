import json
import os

class Storage:
    def __init__(self):
        self.data_dir = "data"
        self.users_file = os.path.join(self.data_dir, "users.json")
        self.transactions_file = os.path.join(self.data_dir, "transactions.json")
        
        # Ensure data directory exists
        os.makedirs(self.data_dir, exist_ok=True)
        
        # Load existing data or initialize empty
        self.users = self.load_users()
        self.transactions = self.load_transactions()

    def load_users(self):
        """Load users from JSON file"""
        if os.path.exists(self.users_file):
            try:
                with open(self.users_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except (json.JSONDecodeError, FileNotFoundError):
                return {}
        return {}

    def save_users(self):
        """Save users to JSON file"""
        try:
            with open(self.users_file, 'w', encoding='utf-8') as f:
                json.dump(self.users, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Error saving users: {e}")

    def load_transactions(self):
        """Load transactions from JSON file"""
        if os.path.exists(self.transactions_file):
            try:
                with open(self.transactions_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except (json.JSONDecodeError, FileNotFoundError):
                return []
        return []

    def save_transactions(self):
        """Save transactions to JSON file"""
        try:
            with open(self.transactions_file, 'w', encoding='utf-8') as f:
                json.dump(self.transactions, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Error saving transactions: {e}")

    def add_user(self, username, password):
        if username not in self.users:
            self.users[username] = password
            self.save_users()  # Persist to file
            return True
        return False

    def validate_user(self, username, password):
        return self.users.get(username) == password

    def add_transaction(self, transaction):
        self.transactions.append(transaction)
        self.save_transactions()  # Persist to file

    def get_transactions(self):
        return self.transactions

    def get_user_balance(self, username):
        balance = 0
        for transaction in self.transactions:
            if transaction['sender'] == username:
                balance -= transaction['amount']
            elif transaction['recipient'] == username:
                balance += transaction['amount']
        return balance