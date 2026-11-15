
from pathlib import Path

from modules.encryption import encrypt_data, decrypt_data


# Project directory
BASE_DIR = Path(__file__).resolve().parent.parent

ORIGINAL_DIR = BASE_DIR / "files" / "original"
ENCRYPTED_DIR = BASE_DIR / "files" / "encrypted"
DECRYPTED_DIR = BASE_DIR / "files" / "decrypted"


def create_directories():
    """Create required directories."""

    ORIGINAL_DIR.mkdir(parents=True, exist_ok=True)
    ENCRYPTED_DIR.mkdir(parents=True, exist_ok=True)
    DECRYPTED_DIR.mkdir(parents=True, exist_ok=True)


def resolve_file_path(file_path):
    """Resolve absolute or project-relative file paths."""

    path = Path(file_path).expanduser()

    if not path.is_absolute():
        path = BASE_DIR / path

    if not path.exists() or not path.is_file():
        raise FileNotFoundError("The specified file was not found.")

    return path


def get_unique_path(directory, filename):
    """Avoid overwriting existing files."""

    output_path = directory / filename

    counter = 1

    while output_path.exists():
        output_path = directory / f"{counter}_{filename}"
        counter += 1

    return output_path


def encrypt_file(file_path, password):
    """Read and encrypt a file."""

    create_directories()

    source = resolve_file_path(file_path)

    with open(source, "rb") as file:
        original_data = file.read()

    encrypted_data = encrypt_data(original_data, password)

    output_path = get_unique_path(
        ENCRYPTED_DIR,
        source.name + ".encrypted"
    )

    with open(output_path, "wb") as file:
        file.write(encrypted_data)

    return output_path


def decrypt_file(file_path, password):
    """Read and decrypt an encrypted file."""

    create_directories()

    source = resolve_file_path(file_path)

    with open(source, "rb") as file:
        encrypted_data = file.read()

    decrypted_data = decrypt_data(encrypted_data, password)

    filename = source.name

    if filename.endswith(".encrypted"):
        filename = filename[:-len(".encrypted")]
    else:
        filename = filename + ".decrypted"

    output_path = get_unique_path(
        DECRYPTED_DIR,
        filename
    )

    with open(output_path, "wb") as file:
        file.write(decrypted_data)

    return output_path
