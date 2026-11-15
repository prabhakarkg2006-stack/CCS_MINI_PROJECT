
from getpass import getpass

from modules.file_manager import encrypt_file, decrypt_file
from modules.history import record_activity, view_history


def display_menu():
    print("\n========================================")
    print("     SECURE FILE ENCRYPTION SYSTEM")
    print("========================================")
    print("1. Encrypt a File")
    print("2. Decrypt a File")
    print("3. View History")
    print("4. Exit")
    print("========================================")


def main():
    while True:

        display_menu()

        choice = input("Enter your choice: ").strip()

        if choice == "1":

            file_path = input("Enter file path: ").strip()
            password = getpass("Enter encryption password: ")

            try:
                output = encrypt_file(file_path, password)

                record_activity(
                    "Encryption",
                    file_path,
                    output
                )

                print("\nFile encrypted successfully!")
                print(f"Saved at: {output}")

            except (ValueError, FileNotFoundError, OSError) as error:
                print(f"\nError: {error}")

        elif choice == "2":

            file_path = input("Enter encrypted file path: ").strip()
            password = getpass("Enter decryption password: ")

            try:
                output = decrypt_file(file_path, password)

                record_activity(
                    "Decryption",
                    file_path,
                    output
                )

                print("\nFile decrypted successfully!")
                print(f"Saved at: {output}")

            except (ValueError, FileNotFoundError, OSError) as error:
                print(f"\nError: {error}")

        elif choice == "3":

            view_history()

        elif choice == "4":

            print("\nThank you for using Secure File Encryption!")
            break

        else:
            print("\nInvalid choice. Please try again.")


if __name__ == "__main__":
    main()
