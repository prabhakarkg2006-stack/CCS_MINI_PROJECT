
import {
  Lock,
  Unlock,
  ShieldCheck,
  FileKey
} from "lucide-react";

function Dashboard({ setActivePage, history = [] }) {
  const encryptedCount = history.filter(
    (item) => item.operation === "Encryption"
  ).length;

  const decryptedCount = history.filter(
    (item) => item.operation === "Decryption"
  ).length;

  return (
    <div className="page">
      <div className="welcome-section">
        <div>
          <p className="eyebrow">SECURITY DASHBOARD</p>
          <h1>Protect Your Files</h1>
          <p>
            Encrypt and decrypt your files securely
            with password-based protection.
          </p>
        </div>
        <ShieldCheck size={65} className="welcome-icon" />
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue"><FileKey /></div>
          <p>Total Operations</p>
          <h2>{history.length}</h2>
        </div>

        <div className="stat-card">
          <div className="stat-icon green"><Lock /></div>
          <p>Files Encrypted</p>
          <h2>{encryptedCount}</h2>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple"><Unlock /></div>
          <p>Files Decrypted</p>
          <h2>{decryptedCount}</h2>
        </div>
      </div>

      <h2 className="section-title">Quick Actions</h2>

      <div className="action-grid">
        <div className="action-card">
          <Lock size={30} />
          <h3>Encrypt File</h3>
          <p>Convert your original file into an encrypted file.</p>
          <button
            className="primary-btn"
            onClick={() => setActivePage("Encrypt File")}
          >
            Start Encryption
          </button>
        </div>

        <div className="action-card">
          <Unlock size={30} />
          <h3>Decrypt File</h3>
          <p>Restore your encrypted file using the correct password.</p>
          <button
            className="secondary-btn"
            onClick={() => setActivePage("Decrypt File")}
          >
            Start Decryption
          </button>
        </div>
      </div>

      <div className="info-card">
        <ShieldCheck size={25} />
        <div>
          <h3>Secure File Protection</h3>
          <p>
            This application uses Fernet authenticated
            encryption with password-based key derivation
            using PBKDF2 and SHA-256.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
