
import { useEffect, useMemo, useState } from "react";
import {
  History as HistoryIcon,
  RefreshCw,
  Search,
  Lock,
  Unlock,
  FileText,
  Clock,
  Filter
} from "lucide-react";

function History() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  async function loadHistory() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/history"
      );

      if (!response.ok) {
        throw new Error("Unable to retrieve history.");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid history data received.");
      }

      setRecords(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  const encryptedCount = records.filter(
    (record) => record.operation === "Encryption"
  ).length;

  const decryptedCount = records.filter(
    (record) => record.operation === "Decryption"
  ).length;

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesFilter =
        filter === "All" || record.operation === filter;

      const searchText = search.toLowerCase();

      const matchesSearch =
        String(record.input_file || "")
          .toLowerCase()
          .includes(searchText) ||
        String(record.output_file || "")
          .toLowerCase()
          .includes(searchText);

      return matchesFilter && matchesSearch;
    });
  }, [records, filter, search]);

  return (
    <div className="page">

      <div className="page-heading">
        <div className="heading-icon">
          <HistoryIcon size={25} />
        </div>

        <div>
          <h1>Operation History</h1>
          <p>
            Track your previous encryption and decryption activities.
          </p>
        </div>
      </div>

      {/* Statistics */}

      <div className="history-stats">

        <div className="history-stat-card">
          <div className="history-stat-icon blue">
            <FileText size={22} />
          </div>
          <div>
            <p>Total Operations</p>
            <h2>{records.length}</h2>
          </div>
        </div>

        <div className="history-stat-card">
          <div className="history-stat-icon green">
            <Lock size={22} />
          </div>
          <div>
            <p>Encrypted Files</p>
            <h2>{encryptedCount}</h2>
          </div>
        </div>

        <div className="history-stat-card">
          <div className="history-stat-icon purple">
            <Unlock size={22} />
          </div>
          <div>
            <p>Decrypted Files</p>
            <h2>{decryptedCount}</h2>
          </div>
        </div>

      </div>

      {/* History table */}

      <div className="history-card">

        <div className="history-header">
          <div>
            <h2>Recent Activities</h2>
            <p className="history-subtitle">
              Your saved SQLite operation records
            </p>
          </div>

          <button
            className="refresh-btn"
            onClick={loadHistory}
            disabled={loading}
          >
            <RefreshCw
              size={16}
              className={loading ? "spin-icon" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Search and filter */}

        <div className="history-controls">

          <div className="history-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search filename..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="history-filter">
            <Filter size={17} />

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="All">All Operations</option>
              <option value="Encryption">Encryption</option>
              <option value="Decryption">Decryption</option>
            </select>
          </div>

        </div>

        {/* Loading */}

        {loading && (
          <div className="history-message">
            <RefreshCw size={25} className="spin-icon" />
            <p>Loading operation history...</p>
          </div>
        )}

        {/* Error */}

        {!loading && error && (
          <div className="error-message">
            {error}
            <button onClick={loadHistory}>
              Try Again
            </button>
          </div>
        )}

        {/* Empty database */}

        {!loading && !error && records.length === 0 && (
          <div className="empty-history">
            <HistoryIcon size={42} />
            <h3>No activities yet</h3>
            <p>
              Your encryption and decryption operations
              will appear here.
            </p>
          </div>
        )}

        {/* No search results */}

        {!loading &&
          !error &&
          records.length > 0 &&
          filteredRecords.length === 0 && (
            <div className="empty-history">
              <Search size={40} />
              <h3>No matching records</h3>
              <p>
                Try another filename or change the operation filter.
              </p>
            </div>
          )}

        {/* Records table */}

        {!loading &&
          !error &&
          filteredRecords.length > 0 && (

            <div className="table-container">

              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Operation</th>
                    <th>Input File</th>
                    <th>Output File</th>
                    <th>Date & Time</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRecords.map((record) => (
                    <tr key={record.id}>
                      <td>#{record.id}</td>

                      <td>
                        <span
                          className={
                            record.operation === "Encryption"
                              ? "status-encrypt"
                              : "status-decrypt"
                          }
                        >
                          {record.operation === "Encryption" ? (
                            <Lock size={13} />
                          ) : (
                            <Unlock size={13} />
                          )}

                          {record.operation}
                        </span>
                      </td>

                      <td>{record.input_file}</td>

                      <td>{record.output_file}</td>

                      <td>
                        <span className="history-date">
                          <Clock size={14} />
                          {record.date}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          )}

        {!loading && !error && records.length > 0 && (
          <div className="history-footer">
            Showing {filteredRecords.length} of {records.length} records
          </div>
        )}

      </div>
    </div>
  );
}

export default History;
