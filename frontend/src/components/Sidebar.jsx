
import {
  LayoutDashboard,
  Lock,
  Unlock,
  History,
  ShieldCheck
} from "lucide-react";

function Sidebar({ activePage, setActivePage }) {
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Encrypt File", icon: Lock },
    { name: "Decrypt File", icon: Unlock },
    { name: "History", icon: History }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-heading">
        MAIN MENU
      </div>

      <nav>
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className={
                activePage === item.name
                  ? "menu-item active"
                  : "menu-item"
              }
              onClick={() => setActivePage(item.name)}
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-security">
        <ShieldCheck size={24} />

        <h4>Secure Protection</h4>

        <p>
          Your files are protected using
          password-based encryption.
        </p>
      </div>

      <div className="sidebar-footer">
        CB3491 Mini Project
      </div>
    </aside>
  );
}

export default Sidebar;
