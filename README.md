# Secure File Encryption and Decryption System

**CB3491 – Cryptography and Cyber Security Mini Project**

A web-based application that protects files using password-based encryption. Users can encrypt files, decrypt previously encrypted files, and view their operation history through a React dashboard.

## 1. Project Overview

The Secure File Encryption and Decryption System is designed to protect digital files from unauthorized access.

The application uses Python cryptographic libraries to encrypt and decrypt files. It provides a React-based frontend, Flask backend, and SQLite database for maintaining operation history.

## 2. Project Objectives

- Implement secure file encryption and decryption.
- Apply password-based cryptographic techniques.
- Develop a user-friendly web interface.
- Maintain operation history using SQLite.
- Reject incorrect passwords and invalid encrypted files.
- Avoid storing passwords and file contents in the operation history.

## 3. Technologies Used

| Component | Technology |
|---|---|
| Frontend | React.js |
| Styling | CSS |
| Icons | Lucide React |
| Backend | Python |
| Backend Framework | Flask |
| Cryptography | Python Cryptography |
| Database | SQLite |
| API Communication | REST API |
| Development Tool | Visual Studio Code |

## 4. Cryptographic Algorithms

The project uses the Fernet authenticated encryption scheme.

**Key derivation:**
- PBKDF2-HMAC-SHA256
- 600,000 iterations
- Random 16-byte salt
- 32-byte derived key before Fernet encoding

**Encryption and authentication:**
- AES-128-CBC encryption
- HMAC-SHA256 authentication

A new random salt is generated for each encryption operation. The same password is required to decrypt the encrypted file.

### Encrypted File Format

The encrypted file contains:
1. Format identifier (`SFE1`)
2. Random 16-byte salt
3. Fernet encrypted token

## 5. Main Features

- File encryption using a password.
- File decryption using the original password.
- Download encrypted and decrypted files.
- Incorrect-password detection.
- Invalid encrypted-file detection.
- Maximum website upload size of 50 MB.
- SQLite operation history.
- Dashboard statistics.
- Search and filter operation history.
- Passwords are not stored in the history database.

## 6. System Architecture

**Frontend:** React provides the dashboard, file selection, password inputs, and operation history display.

**Backend:** Flask receives uploaded files and performs encryption or decryption.

**Database:** SQLite stores operation details such as operation type, filenames, and date and time.

Website file processing is performed in memory rather than permanently storing uploaded files on the server.

## 7. Installation and Setup

### Requirements

- Python 3.10 or later
- Node.js and npm
- Git

### Step 1: Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd Secure_File_Encryption
```

Replace the placeholder with your actual repository URL.

### Step 2: Create a Python virtual environment

```powershell
python -m venv .venv
```

Activate it:

```powershell
.\.venv\Scripts\Activate.ps1
```

### Step 3: Install Python dependencies

```powershell
python -m pip install -r requirements.txt
```

### Step 4: Install frontend dependencies

```powershell
cd frontend
npm install
```

## 8. Run the Application

The backend and frontend must run in separate terminals.

### Terminal 1 – Start Backend

```powershell
cd Secure_File_Encryption
.\.venv\Scripts\Activate.ps1
python backend/app.py
```

Backend address:

`http://127.0.0.1:5000`

### Terminal 2 – Start Frontend

```powershell
cd Secure_File_Encryption/frontend
npm run dev
```

Open the application:

`http://localhost:5173`

## 9. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check backend status |
| POST | `/api/encrypt` | Encrypt an uploaded file |
| POST | `/api/decrypt` | Decrypt an uploaded file |
| GET | `/api/history` | Retrieve operation history |

## 10. Project Modules

- `encryption.py` – Handles cryptographic operations.
- `file_manager.py` – Manages local file encryption and decryption for the CLI.
- `history.py` – Handles operation history.
- `database.py` – Manages SQLite database operations.
- `app.py` – Implements Flask backend APIs.
- `main.py` – Provides the command-line interface.

## 11. Testing

The following functional tests were completed:

- Backend health API check.
- Frontend and backend connection.
- Successful file encryption.
- Successful file decryption.
- Incorrect-password rejection.
- Invalid encrypted-file rejection.
- SQLite operation history verification.
- History search and filter functionality.

All the above tests passed during local project testing.

## 12. Limitations

- Website uploads are limited to 50 MB.
- Users must remember their encryption passwords.
- No user authentication or account management is currently implemented.
- This is an academic local application, not a production cloud-storage security service.

## 13. Future Enhancements

- User authentication and account management.
- Larger-file streaming support.
- Secure cloud storage integration.
- Improved password-strength guidance.
- Deployment using a production web server.

## 14. Conclusion

The Secure File Encryption and Decryption System demonstrates the practical application of cryptographic techniques for protecting digital files. It combines password-based key derivation, authenticated encryption, a React frontend, Flask backend, and SQLite operation history into a functional file security application.

**Project:** Secure File Encryption and Decryption System  
**Subject:** CB3491 – Cryptography and Cyber Security