
import sqlite3
from pathlib import Path
from datetime import datetime


BASE_DIR = Path(__file__).resolve().parent.parent
DATABASE_FILE = BASE_DIR / "data" / "history.db"


def get_connection():
    DATABASE_FILE.parent.mkdir(parents=True, exist_ok=True)

    connection = sqlite3.connect(
        DATABASE_FILE,
        timeout=10
    )

    connection.row_factory = sqlite3.Row

    # Wait for database operations instead of failing immediately
    connection.execute("PRAGMA busy_timeout = 10000")

    return connection


def initialize_database():
    connection = get_connection()

    try:
        # Improve reliability during simultaneous database access
        connection.execute("PRAGMA journal_mode = WAL")

        connection.execute("""
            CREATE TABLE IF NOT EXISTS operation_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                operation TEXT NOT NULL,
                input_file TEXT NOT NULL,
                output_file TEXT NOT NULL,
                date TEXT NOT NULL
            )
        """)

        connection.commit()

    except sqlite3.Error:
        connection.rollback()
        raise

    finally:
        connection.close()


def save_activity(operation, input_file, output_file):
    initialize_database()

    connection = get_connection()

    try:
        connection.execute("""
            INSERT INTO operation_history (
                operation,
                input_file,
                output_file,
                date
            )
            VALUES (?, ?, ?, ?)
        """, (
            operation,
            str(input_file),
            str(output_file),
            datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        ))

        connection.commit()

    except sqlite3.Error:
        connection.rollback()
        raise

    finally:
        connection.close()


def fetch_history():
    initialize_database()

    connection = get_connection()

    try:
        records = connection.execute("""
            SELECT
                id,
                operation,
                input_file,
                output_file,
                date
            FROM operation_history
            ORDER BY id DESC
        """).fetchall()

        return [dict(record) for record in records]

    finally:
        connection.close()
