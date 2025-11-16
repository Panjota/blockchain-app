import hashlib
import os

def hash_string(input_string):
    return hashlib.sha256(input_string.encode()).hexdigest()

def generate_token():
    return os.urandom(16).hex()

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password, hashed_password):
    return hash_password(password) == hashed_password