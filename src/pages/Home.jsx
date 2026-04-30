import { useState, useEffect } from "react";
import DOMPurify from "dompurify";

export default function Home() {
  const [input, setInput] = useState("");
  const [entries, setEntries] = useState([]);
  const [showRaw, setShowRaw] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("feedback_entries");
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch (e) {
        setEntries([]);
      }
    }
  }, []);

  const handleSubmit = () => {
    if (!input.trim()) return;
    const sanitized = DOMPurify.sanitize(input);
    const entry = {
      id: Date.now(),
      raw: input,
      sanitized: sanitized
    };
    const updated = [entry, ...entries].slice(0, 10);
    setEntries(updated);
    window.localStorage.setItem("feedback_entries", JSON.stringify(updated));
    setInput("");
  };

  const clearAll = () => {
    setEntries([]);
    window.localStorage.removeItem("feedback_entries");
  };

  return (
    <main className="landing-page">
      <h1>Welcome to Our Website</h1>
      <div className="card">
        <p>Computer Networks Project 2</p>
        <p>Team: Asha Iman &amp; Hania Zaidi</p>
      </div>

      <div className="card">
        <h2>Feedback (XSS Protection Demo)</h2>
        <p>
          This form demonstrates XSS protection using DOMPurify. Try submitting
          a malicious payload such as:
        </p>
        <pre style={{ background: "#f4f4f4", padding: "8px", borderRadius: "4px", overflowX: "auto" }}>
          {String.raw`<img src=x onerror="alert('XSS')">`}
        </pre>
        <p>
          DOMPurify will sanitize the input before it is rendered, preventing the
          script from executing.
        </p>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your feedback here..."
          rows={3}
          style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", fontFamily: "inherit" }}
        />

        <div style={{ marginTop: "8px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button onClick={handleSubmit} style={{ padding: "8px 16px", borderRadius: "4px", border: "none", background: "#4a90e2", color: "white", cursor: "pointer" }}>
            Submit
          </button>
          <button onClick={() => setShowRaw(!showRaw)} style={{ padding: "8px 16px", borderRadius: "4px", border: "1px solid #ccc", background: "white", color: "#8a0392c8", cursor: "pointer" }}>
            {showRaw ? "Hide" : "Show"} Raw Input (debug)
          </button>
          <button onClick={clearAll} style={{ padding: "8px 16px", borderRadius: "4px", border: "1px solid #d9534f", background: "white", color: "#d9534f", cursor: "pointer" }}>
            Clear All
          </button>
        </div>

        {entries.length > 0 && (
          <div style={{ marginTop: "16px" }}>
            <h3>Submitted Feedback ({entries.length})</h3>
            {entries.map((entry) => (
              <div key={entry.id} style={{ borderTop: "1px solid #eee", paddingTop: "8px", marginTop: "8px" }}>
                <div>
                  <strong>Sanitized (rendered safely):</strong>
                  <div style={{ background: "#e8f5e9", padding: "8px", borderRadius: "4px", marginTop: "4px" }} dangerouslySetInnerHTML={{ __html: entry.sanitized }} />
                </div>
                {showRaw && (
                  <div style={{ marginTop: "8px" }}>
                    <strong>Raw input (escaped, not rendered):</strong>
                    <pre style={{ background: "#fff3e0", padding: "8px", borderRadius: "4px", overflowX: "auto", whiteSpace: "pre-wrap" }}>{entry.raw}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
