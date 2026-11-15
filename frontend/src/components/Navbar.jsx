
import { ShieldCheck, LockKeyhole } from "lucide-react";

function Navbar() {
  return (
    <header className="navbar">
      <div className="nav-brand">
        <div className="brand-icon">
          <ShieldCheck size={25} />
        </div>

        <div>
          <h2>SecureVault</h2>
          <p>File Protection System</p>
        </div>
      </div>

      <div className="nav-status">
        <LockKeyhole size={17} />
        <span>Local Secure Environment</span>
      </div>
    </header>
  );
}

export default Navbar;
