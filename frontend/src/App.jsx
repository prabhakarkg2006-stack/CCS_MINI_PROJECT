
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Encrypt from "./pages/Encrypt";
import Decrypt from "./pages/Decrypt";
import History from "./pages/History";

import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function loadHistory() {
      try {
        const response = await fetch(
          "http://127.0.0.1:5000/api/history"
        );

        if (response.ok) {
          const data = await response.json();

          setHistory(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("History loading failed:", error);
      }
    }

    loadHistory();
  }, [activePage]);

  function renderPage() {
    switch (activePage) {
      case "Encrypt File":
        return <Encrypt />;

      case "Decrypt File":
        return <Decrypt />;

      case "History":
        return <History />;

      default:
        return (
          <Dashboard
            setActivePage={setActivePage}
            history={history}
          />
        );
    }
  }

  return (
    <div className="app-container">

      <Navbar />

      <div className="main-layout">

        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
        />

        <main className="content-area">
          {renderPage()}
        </main>

      </div>

    </div>
  );
}

export default App;
