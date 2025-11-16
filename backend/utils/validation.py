def validate_user_input(username, password):
    if not username or not password:
        return False, "Username and password cannot be empty."
    if len(username) < 3 or len(password) < 6:
        return False, "Username must be at least 3 characters and password at least 6 characters long."
    return True, ""

def validate_transaction_data(sender, recipient, amount):
    if not sender or not recipient:
        return False, "Sender and recipient cannot be empty."
    if amount <= 0:
        return False, "Amount must be greater than zero."
    return True, ""