import json
import os

class TokenEconomy:
    """
    Manages the token economy for the blockchain network
    Total supply: 1,000,000 tokens
    Initial user balance: 10 tokens
    """
    
    TOTAL_SUPPLY = 1_000_000.0
    INITIAL_USER_BALANCE = 10.0
    NETWORK_ADDRESS = "NETWORK"
    
    def __init__(self):
        self.data_dir = "data"
        self.balances_file = os.path.join(self.data_dir, "balances.json")
        
        # Ensure data directory exists
        os.makedirs(self.data_dir, exist_ok=True)
        
        # Load existing balances or initialize
        self.balances, self.total_distributed = self.load_balances()
    
    def load_balances(self):
        """Load balances from JSON file"""
        if os.path.exists(self.balances_file):
            try:
                with open(self.balances_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    balances = data.get('balances', {})
                    total_distributed = data.get('total_distributed', 0.0)
                    
                    # Ensure network address exists
                    if self.NETWORK_ADDRESS not in balances:
                        balances[self.NETWORK_ADDRESS] = self.TOTAL_SUPPLY - total_distributed
                    
                    return balances, total_distributed
            except (json.JSONDecodeError, FileNotFoundError):
                pass
        
        # Initialize with full supply in network
        return {self.NETWORK_ADDRESS: self.TOTAL_SUPPLY}, 0.0
    
    def save_balances(self):
        """Save balances to JSON file"""
        try:
            data = {
                'balances': self.balances,
                'total_distributed': self.total_distributed,
                'total_supply': self.TOTAL_SUPPLY,
                'initial_user_balance': self.INITIAL_USER_BALANCE
            }
            with open(self.balances_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Error saving balances: {e}")
    
    def create_user_account(self, username):
        """Create a new user account with initial balance"""
        if username in self.balances:
            return False, "User already exists"
        
        if self.total_distributed + self.INITIAL_USER_BALANCE > self.TOTAL_SUPPLY:
            return False, "Insufficient network funds"
        
        # Transfer from network to user
        self.balances[self.NETWORK_ADDRESS] -= self.INITIAL_USER_BALANCE
        self.balances[username] = self.INITIAL_USER_BALANCE
        self.total_distributed += self.INITIAL_USER_BALANCE
        
        # Persist changes
        self.save_balances()
        
        return True, f"Account created with {self.INITIAL_USER_BALANCE} tokens"
    
    def get_balance(self, username):
        """Get user balance"""
        return self.balances.get(username, 0.0)
    
    def transfer_tokens(self, sender, recipient, amount):
        """Transfer tokens between users"""
        if sender == recipient:
            return False, "Cannot send transaction to yourself"
        
        if sender not in self.balances:
            return False, "Sender account not found"
        
        if recipient not in self.balances:
            return False, "Recipient account not found"
        
        if self.balances[sender] < amount:
            return False, "Insufficient funds"
        
        if amount <= 0:
            return False, "Amount must be positive"
        
        # Perform transfer
        self.balances[sender] -= amount
        self.balances[recipient] += amount
        
        # Persist changes
        self.save_balances()
        
        return True, "Transfer successful"
    
    def get_network_stats(self):
        """Get network statistics"""
        return {
            'total_supply': self.TOTAL_SUPPLY,
            'total_distributed': self.total_distributed,
            'network_reserve': self.balances[self.NETWORK_ADDRESS],
            'active_accounts': len([b for b in self.balances.keys() if b != self.NETWORK_ADDRESS])
        }