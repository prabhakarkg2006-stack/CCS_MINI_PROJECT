
import os
import base64

from cryptography.fernet import Fernet, InvalidToken
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC


# Encryption file format identifier
MAGIC = b"SFE1"

# Security settings
SALT_SIZE = 16
ITERATIONS = 600_000


def generate_key(password, salt):
    """Generate a secure encryption key from a password."""

    if not password:
        raise ValueError("Password cannot be empty.")

    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=ITERATIONS
    )

    key = base64.urlsafe_b64encode(
        kdf.derive(password.encode("utf-8"))
    )

    return key


def encrypt_data(data, password):
    """Encrypt file data using Fernet."""

    salt = os.urandom(SALT_SIZE)

    key = generate_key(password, salt)

    cipher = Fernet(key)

    encrypted_data = cipher.encrypt(data)

    # Store format identifier + salt + encrypted content
    return MAGIC + salt + encrypted_data


def decrypt_data(encrypted_data, password):
    """Decrypt previously encrypted file data."""

    if not encrypted_data.startswith(MAGIC):
        raise ValueError("Invalid or unsupported encrypted file.")

    salt = encrypted_data[
        len(MAGIC):len(MAGIC) + SALT_SIZE
    ]

    token = encrypted_data[len(MAGIC) + SALT_SIZE:]

    if len(salt) != SALT_SIZE or not token:
        raise ValueError("Encrypted file is damaged.")

    key = generate_key(password, salt)

    cipher = Fernet(key)

    try:
        return cipher.decrypt(token)
    except InvalidToken:
        raise ValueError(
            "Incorrect password or corrupted encrypted file."
        )
