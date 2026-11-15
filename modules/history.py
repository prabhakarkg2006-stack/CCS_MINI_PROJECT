
from modules.database import save_activity, fetch_history


def record_activity(operation, input_file, output_file):
    save_activity(operation, input_file, output_file)


def view_history():
    history = fetch_history()

    if not history:
        print("\nNo history available.")
        return

    print("\n========== OPERATION HISTORY ==========")

    for record in history:
        print(f"\nRecord: {record['id']}")
        print(f"Operation: {record['operation']}")
        print(f"Input: {record['input_file']}")
        print(f"Output: {record['output_file']}")
        print(f"Date: {record['date']}")
