
import { useRef, useState } from "react";
import {
  Lock,
  Upload,
  FileKey,
  Eye,
  EyeOff,
  X,
  ShieldCheck,
  LoaderCircle
} from "lucide-react";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

function Encrypt() {
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleFileChange(event) {
    const selectedFile = event.target.files[0];

    setError("");
    setMessage("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.size === 0) {
      setError("The selected file is empty.");
      event.target.value = "";
      setFile(null);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File size cannot exceed 50 MB.");
      event.target.value = "";
      setFile(null);
      return;
    }

    setFile(selectedFile);
  }

  function clearFile() {
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleEncrypt() {
    setError("");
    setMessage("");

    if (!file) {
      setError("Please select a file.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter an encryption password.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("password", password);

      const response = await fetch(
        "http://127.0.0.1:5000/api/encrypt",
        {
          method: "POST",
          body: formData
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Encryption failed.");
      }

      const blob = await response.blob();

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download = file.name + ".encrypted";

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => {
        window.URL.revokeObjectURL(downloadUrl);
      }, 1000);

      setMessage("Your file was encrypted successfully and downloaded.");

      setPassword("");
      clearFile();

    } catch (err) {
      setError(err.message || "Unable to encrypt the file.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">

      <div className="page-heading">
        <div className="heading-icon">
          <Lock size={25} />
        </div>

        <div>
          <h1>Encrypt Your File</h1>
          <p>
            Protect your files using password-based encryption.
          </p>
        </div>
      </div>

      <div className="form-card">

        <h2>File Encryption</h2>

        <label className="upload-area">
          <Upload size={35} />

          <h3>Select your file</h3>

          <p>Click here to browse files</p>

          <p>Maximum file size: 50 MB</p>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            disabled={loading}
          />
        </label>

        {file && (
          <div className="selected-file">
            <FileKey size={20} />

            <span>
              {file.name} (
              {(file.size / (1024 * 1024)).toFixed(2)} MB)
            </span>

            <button
              type="button"
              onClick={clearFile}
              disabled={loading}
              title="Remove selected file"
            >
              <X size={18} />
            </button>
          </div>
        )}

        <label className="input-label">
          Encryption Password
        </label>

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            className="text-input"
            placeholder="Enter a strong password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={loading}
            autoComplete="new-password"
          />

          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
          </button>
        </div>

        <div className="security-note">
          <ShieldCheck size={18} />
          <span>
            Remember your password. You need the same password
            to decrypt your file.
          </span>
        </div>

        <button
          className="primary-btn full-btn"
          onClick={handleEncrypt}
          disabled={loading}
        >
          {loading ? (
            <>
              <LoaderCircle size={18} />
              Encrypting...
            </>
          ) : (
            <>
              <Lock size={18} />
              Encrypt File
            </>
          )}
        </button>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

      </div>
    </div>
  );
}

export default Encrypt;
