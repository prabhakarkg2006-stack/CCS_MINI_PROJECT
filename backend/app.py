
import sys
import io
import sqlite3

from pathlib import Path

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename

# ---------------------------------
# PROJECT PATH
# ---------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

# ---------------------------------
# PROJECT MODULES
# ---------------------------------

from modules.encryption import encrypt_data, decrypt_data
from modules.history import record_activity
from modules.database import fetch_history, initialize_database

# ---------------------------------
# FLASK APPLICATION
# ---------------------------------

app = Flask(__name__)

CORS(app, origins=["http://localhost:5173"])

# Maximum upload size: 50 MB
app.config["MAX_CONTENT_LENGTH"] = 50 * 1024 * 1024


# ---------------------------------
# COMMON FILE VALIDATION
# ---------------------------------

def validate_upload(uploaded_file, password):

    if uploaded_file is None:
        raise ValueError("Please select a file.")

    if not uploaded_file.filename:
        raise ValueError("Filename is missing.")

    if not password:
        raise ValueError("Password is required.")

    filename = secure_filename(uploaded_file.filename)

    if not filename:
        raise ValueError("Invalid filename.")

    file_data = uploaded_file.read()

    if not file_data:
        raise ValueError("The selected file is empty.")

    return filename, file_data


# ---------------------------------
# HEALTH CHECK API
# ---------------------------------

@app.route("/api/health", methods=["GET"])
def health():

    return jsonify({
        "status": "success",
        "message": "Secure File Encryption Backend is running!"
    })


# ---------------------------------
# ENCRYPT FILE API
# ---------------------------------

@app.route("/api/encrypt", methods=["POST"])
def encrypt():

    try:
        uploaded_file = request.files.get("file")
        password = request.form.get("password", "")

        filename, original_data = validate_upload(
            uploaded_file,
            password
        )

        # Encrypt file contents in memory
        encrypted_data = encrypt_data(
            original_data,
            password
        )

        output_filename = filename + ".encrypted"

        # Save operation details in SQLite
        record_activity(
            "Encryption",
            filename,
            output_filename
        )

        # Return encrypted file as download
        return send_file(
            io.BytesIO(encrypted_data),
            as_attachment=True,
            download_name=output_filename,
            mimetype="application/octet-stream"
        )

    except ValueError as error:

        return jsonify({
            "error": str(error)
        }), 400

    except sqlite3.Error:

        app.logger.exception("Encryption history database error")

        return jsonify({
            "error": "File encrypted, but operation history could not be saved."
        }), 500

    except Exception:

        app.logger.exception("Unexpected encryption error")

        return jsonify({
            "error": "An unexpected error occurred during encryption."
        }), 500


# ---------------------------------
# DECRYPT FILE API
# ---------------------------------

@app.route("/api/decrypt", methods=["POST"])
def decrypt():

    try:
        uploaded_file = request.files.get("file")
        password = request.form.get("password", "")

        filename, encrypted_data = validate_upload(
            uploaded_file,
            password
        )

        # Decrypt file contents in memory
        decrypted_data = decrypt_data(
            encrypted_data,
            password
        )

        # Restore original filename
        if filename.endswith(".encrypted"):
            output_filename = filename[:-10]
        else:
            output_filename = filename + ".decrypted"

        # Save operation details in SQLite
        record_activity(
            "Decryption",
            filename,
            output_filename
        )

        # Return restored file as download
        return send_file(
            io.BytesIO(decrypted_data),
            as_attachment=True,
            download_name=output_filename,
            mimetype="application/octet-stream"
        )

    except ValueError as error:

        return jsonify({
            "error": str(error)
        }), 400

    except sqlite3.Error:

        app.logger.exception("Decryption history database error")

        return jsonify({
            "error": "File decrypted, but operation history could not be saved."
        }), 500

    except Exception:

        app.logger.exception("Unexpected decryption error")

        return jsonify({
            "error": "An unexpected error occurred during decryption."
        }), 500


# ---------------------------------
# SQLITE HISTORY API
# ---------------------------------

@app.route("/api/history", methods=["GET"])
def history():

    try:
        records = fetch_history()

        return jsonify(records)

    except Exception:

        app.logger.exception("History retrieval failed")

        return jsonify({
            "error": "Unable to retrieve operation history."
        }), 500


# ---------------------------------
# FILE SIZE ERROR HANDLER
# ---------------------------------

@app.errorhandler(413)
def file_too_large(error):

    return jsonify({
        "error": "File size exceeds the 50 MB limit."
    }), 413


# ---------------------------------
# START BACKEND SERVER
# ---------------------------------

if __name__ == "__main__":

    initialize_database()

    print("Starting Secure File Encryption Backend...")
    print("SQLite database initialized successfully.")
    print("File processing: In-memory mode.")
    print("Debug mode: Disabled.")

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=False
    )
