
import { useRef, useState } from "react";
import {
  Unlock,
  Upload,
  FileKey,
  Eye,
  EyeOff,
  X,
  ShieldCheck,
  LoaderCircle
} from "lucide-react";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

function Decrypt() {
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
      setError("The selected encrypted file is empty.");
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

  async function handleDecrypt() {
    setError("");
    setMessage("");

    if (!file) {
      setError("Please select an encrypted file.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter the original password.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("password", password);

      const response = await fetch(
        "http://127.0.0.1:5000/api/decrypt",
        {
          method: "POST",
          body: formData
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Decryption failed.");
      }

      const blob = await response.blob();

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = downloadUrl;

      link.download = file.name.endsWith(".encrypted")
        ? file.name.slice(0, -10)
        : file.name + ".decrypted";

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => {
        window.URL.revokeObjectURL(downloadUrl);
      }, 1000);

      setMessage("Your file was decrypted successfully and downloaded.");

      setPassword("");
      clearFile();

    } catch (err) {
      setError(
        err.message || "Unable to decrypt the file."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">

      <div className="page-heading">
        <div className="heading-icon purple">
          <Unlock size={25} />
        </div>

        <div>
          <h1>Decrypt Your File</h1>
          <p>
            Restore your original file using its password.
          </p>
        </div>
      </div>

      <div className="form-card">

        <h2>File Decryption</h2>

        <label className="upload-area">
          <Upload size={35} />

          <h3>Select encrypted file</h3>

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
          Decryption Password
        </label>

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            className="text-input"
            placeholder="Enter the original password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={loading}
            autoComplete="current-password"
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
            Enter the same password that was used to encrypt this file.
          </span>
        </div>

        <button
          className="secondary-btn full-btn"
          onClick={handleDecrypt}
          disabled={loading}
        >
          {loading ? (
            <>
              <LoaderCircle size={18} />
              Decrypting...
            </>
          ) : (
            <>
              <Unlock size={18} />
              Decrypt File
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

export default Decrypt;
