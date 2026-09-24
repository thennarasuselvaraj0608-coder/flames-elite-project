
import { useEffect, useState } from "react";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/flames";

const FLAMES_MEANINGS = {
  F: {
    title: "Forever Friendship",
    icon: "🤝",
    description:
      "A friendship that grows stronger with every memory you create together.",
    score: 96,
    message:
      "Some friendships are not just moments — they become beautiful memories for a lifetime.",
  },
  L: {
    title: "Lifelong Friends",
    icon: "💜",
    description:
      "A special bond with the potential to remain strong through every stage of life.",
    score: 91,
    message:
      "True friendship is not about being together every day, but staying connected through every chapter.",
  },
  A: {
    title: "Amazing Bond",
    icon: "✨",
    description:
      "A beautiful connection filled with positive energy, trust and unforgettable moments.",
    score: 88,
    message:
      "Some people simply make life brighter. Your bond has that special spark.",
  },
  M: {
    title: "Memorable Bond",
    icon: "💫",
    description:
      "A meaningful connection that can create memories worth keeping forever.",
    score: 84,
    message:
      "The best memories are often created with the people who make ordinary moments special.",
  },
  E: {
    title: "Endless Friendship",
    icon: "♾️",
    description:
      "A strong friendship with an energetic connection that keeps growing over time.",
    score: 94,
    message:
      "Some friendships don't have an expiry date — they simply become part of your story.",
  },
  S: {
    title: "Strong Friendship",
    icon: "💙",
    description:
      "A powerful friendship built around trust, support and shared experiences.",
    score: 89,
    message:
      "A strong friend is someone who stays beside you through both the good days and difficult ones.",
  },
};

function getInitials(name) {
  if (!name) return "?";

  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return (
    words[0][0] + words[words.length - 1][0]
  ).toUpperCase();
}

function App() {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const [copied, setCopied] = useState(false);
  const [confetti, setConfetti] = useState([]);

  // ================================
  // LOAD HISTORY
  // ================================

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("flamesEliteHistory");

      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);

        if (Array.isArray(parsedHistory)) {
          setHistory(parsedHistory);
        }
      }
    } catch (error) {
      console.error("History loading error:", error);
      localStorage.removeItem("flamesEliteHistory");
    }
  }, []);

  // ================================
  // SAVE HISTORY
  // ================================

  useEffect(() => {
    try {
      localStorage.setItem(
        "flamesEliteHistory",
        JSON.stringify(history)
      );
    } catch (error) {
      console.error("History save error:", error);
    }
  }, [history]);

  // ================================
  // CONFETTI
  // ================================

  const createConfetti = () => {
    const pieces = Array.from({ length: 35 }, (_, index) => ({
      id: `${Date.now()}-${index}`,
      left: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 3 + Math.random() * 2,
      symbol: ["✦", "♥", "✧", "•"][
        Math.floor(Math.random() * 4)
      ],
    }));

    setConfetti(pieces);

    setTimeout(() => {
      setConfetti([]);
    }, 5500);
  };

  // ================================
  // VALIDATE
  // ================================

  const validateNames = () => {
    const first = name1.trim();
    const second = name2.trim();

    if (!first || !second) {
      setError("Please enter both names.");
      return false;
    }

    if (first.length < 2 || second.length < 2) {
      setError("Names must contain at least 2 characters.");
      return false;
    }

    if (first.length > 50 || second.length > 50) {
      setError("Names must be less than 50 characters.");
      return false;
    }

    if (
      !/^[a-zA-Z\s]+$/.test(first) ||
      !/^[a-zA-Z\s]+$/.test(second)
    ) {
      setError("Please use letters and spaces only.");
      return false;
    }

    return true;
  };

  // ================================
  // ANALYZE
  // ================================

  const analyzeNames = async () => {
    setError("");
    setCopied(false);

    if (!validateNames()) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name1: name1.trim(),
          name2: name2.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Server error: ${response.status}`
        );
      }

      const data = await response.json();

      console.log("Backend response:", data);

      if (!data?.success || !data?.result) {
        throw new Error("Invalid response from server.");
      }

      const serverResult = data.result;

      if (!serverResult.letter) {
        throw new Error("FLAMES result letter missing.");
      }

      const letter = serverResult.letter.toUpperCase();

      const meaning = FLAMES_MEANINGS[letter];

      if (!meaning) {
        throw new Error("Unknown FLAMES result.");
      }

      const finalResult = {
        id: data.analysisId || Date.now(),

        name1: data.name1 || name1.trim(),
        name2: data.name2 || name2.trim(),

        letter,

        title: serverResult.title || meaning.title,

        icon: serverResult.icon || meaning.icon,

        description:
          serverResult.description || meaning.description,

        score:
          serverResult.score ?? meaning.score,

        message:
          serverResult.message || meaning.message,

        createdAt: new Date().toLocaleString(),
      };

      setResult(finalResult);

      // Add latest result to history
      setHistory((previous) => {
        const filtered = previous.filter(
          (item) =>
            !(
              item.name1.toLowerCase() ===
                finalResult.name1.toLowerCase() &&
              item.name2.toLowerCase() ===
                finalResult.name2.toLowerCase()
            )
        );

        return [finalResult, ...filtered].slice(0, 20);
      });

      createConfetti();

      setTimeout(() => {
        document
          .getElementById("result-section")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 150);
    } catch (err) {
      console.error("Analyze error:", err);

      setError(
        err.message ||
          "Something went wrong. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // HISTORY BUTTON
  // ================================

  const toggleHistory = () => {
    setError("");
    setShowHistory((previous) => !previous);

    setTimeout(() => {
      document
        .getElementById("history-section")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };

  // ================================
  // CLOSE HISTORY
  // ================================

  const closeHistory = () => {
    setShowHistory(false);
  };

  // ================================
  // LOAD HISTORY ITEM
  // ================================

  const loadHistoryResult = (item) => {
    setName1(item.name1);
    setName2(item.name2);

    setResult(item);

    setShowHistory(false);

    setError("");

    setTimeout(() => {
      document
        .getElementById("result-section")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 150);
  };

  // ================================
  // CLEAR HISTORY
  // ================================

  const clearHistory = () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear all analysis history?"
    );

    if (!confirmClear) return;

    setHistory([]);
    localStorage.removeItem("flamesEliteHistory");
  };

  // ================================
  // RESET
  // ================================

  const resetAll = () => {
    setName1("");
    setName2("");
    setResult(null);
    setError("");
    setCopied(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================================
  // COPY RESULT
  // ================================

  const copyResult = async () => {
    if (!result) return;

    const text = `FLAMES Elite Result ❤️

${result.name1} + ${result.name2}

${result.icon} ${result.title}
Compatibility Score: ${result.score}%

${result.message}`;

    try {
      await navigator.clipboard.writeText(text);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(error);
      setError("Unable to copy the result.");
    }
  };

  // ================================
  // SHARE RESULT
  // ================================

  const shareResult = async () => {
    if (!result) return;

    const shareText = `${result.name1} + ${result.name2} → ${result.title} ${result.icon} (${result.score}%)`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "FLAMES Elite Result",
          text: shareText,
        });
      } catch {
        // User cancelled
      }
    } else {
      await copyResult();
    }
  };

  // ================================
  // JSX
  // ================================

  return (
    <div className="app">

      {/* BACKGROUND */}

      <div className="background">
        <div className="orb orb-one" />
        <div className="orb orb-two" />
        <div className="orb orb-three" />
      </div>

      {/* CONFETTI */}

      {confetti.length > 0 && (
        <div className="confetti-container">
          {confetti.map((piece) => (
            <span
              key={piece.id}
              className="confetti"
              style={{
                left: `${piece.left}%`,
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`,
              }}
            >
              {piece.symbol}
            </span>
          ))}
        </div>
      )}

      {/* NAVBAR */}

      <header className="navbar">

        <div className="brand">

          <div className="brand-logo">
            F
          </div>

          <div>
            <h2>FLAMES</h2>
            <span>ELITE</span>
          </div>

        </div>

        <div className="nav-actions">

          <div className="nav-badge">
            <span className="status-dot" />
            SYSTEM ONLINE
          </div>

          <button
            type="button"
            className="history-button"
            onClick={toggleHistory}
          >
            🕘 History
          </button>

        </div>

      </header>

      <main className="main-container">

        {/* HERO */}

        <section className="hero-section">

          <div className="hero-badge">
            ✦{" "}
            <span>
              THE ULTIMATE FRIENDSHIP ANALYZER
            </span>
          </div>

          <h1>
            Discover Your
            <br />
            <span>Friendship Vibe.</span>
          </h1>

          <p className="hero-description">
            Enter two names and let FLAMES Elite reveal
            the unique connection, energy and friendship
            between them.
          </p>

        </section>

        {/* ANALYZER */}

        <section className="analyzer-card">

          <div className="card-glow" />

          <div className="card-header">

            <div>
              <p className="small-label">
                START ANALYSIS
              </p>

              <h2>
                Who are we analyzing?
              </h2>
            </div>

            <div className="flames-mini">
              {Object.keys(FLAMES_MEANINGS).map(
                (letter) => (
                  <span key={letter}>
                    {letter}
                  </span>
                )
              )}
            </div>

          </div>

          <div className="inputs-wrapper">

            <div className="name-input-group">

              <label>
                FIRST PERSON
              </label>

              <div className="input-box">

                <span className="input-icon">
                  👤
                </span>

                <input
                  type="text"
                  value={name1}
                  maxLength={50}
                  placeholder="Enter first name"
                  onChange={(event) => {
                    setName1(event.target.value);
                    setError("");
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      analyzeNames();
                    }
                  }}
                />

              </div>

            </div>

            <div className="connection-symbol">
              <div className="plus-circle">
                +
              </div>
            </div>

            <div className="name-input-group">

              <label>
                SECOND PERSON
              </label>

              <div className="input-box">

                <span className="input-icon">
                  👤
                </span>

                <input
                  type="text"
                  value={name2}
                  maxLength={50}
                  placeholder="Enter second name"
                  onChange={(event) => {
                    setName2(event.target.value);
                    setError("");
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      analyzeNames();
                    }
                  }}
                />

              </div>

            </div>

          </div>

          {error && (
            <div className="error-message">
              <span>!</span>
              {error}
            </div>
          )}

          <button
            type="button"
            className="analyze-button"
            onClick={analyzeNames}
            disabled={loading}
          >

            <span className="button-icon">
              {loading ? "⏳" : "✦"}
            </span>

            {loading
              ? "ANALYZING..."
              : "REVEAL FRIENDSHIP"}

            <span className="button-arrow">
              →
            </span>

          </button>

          <p className="privacy-note">
            🔒 Your names stay private and are used only
            for this analysis.
          </p>

        </section>

        {/* ========================= */}
        {/* HISTORY */}
        {/* ========================= */}

        {showHistory && (
          <section
            className="history-section"
            id="history-section"
          >

            <div className="history-header">

              <div>
                <p className="small-label">
                  YOUR JOURNEY
                </p>

                <h2>
                  Analysis History
                </h2>
              </div>

              <button
                type="button"
                className="close-history"
                onClick={closeHistory}
              >
                ×
              </button>

            </div>

            {history.length === 0 ? (

              <div className="history-empty">
                No previous analyses yet.
                <br />
                Start your first FLAMES analysis!
              </div>

            ) : (

              <>
                <div className="history-list">

                  {history.map((item) => (

                    <button
                      type="button"
                      key={item.id}
                      className="history-card"
                      onClick={() =>
                        loadHistoryResult(item)
                      }
                    >

                      <div className="history-avatars">

                        <span>
                          {getInitials(item.name1)}
                        </span>

                        <b>♥</b>

                        <span>
                          {getInitials(item.name2)}
                        </span>

                      </div>

                      <div className="history-info">

                        <h3>
                          {item.name1} +{" "}
                          {item.name2}
                        </h3>

                        <p>
                          {item.title}
                        </p>

                      </div>

                      <div className="history-score">

                        <strong>
                          {item.score}%
                        </strong>

                        <small>
                          {item.letter}
                        </small>

                      </div>

                    </button>

                  ))}

                </div>

                <button
                  type="button"
                  className="reset-action"
                  style={{ marginTop: "20px" }}
                  onClick={clearHistory}
                >
                  Clear History
                </button>
              </>
            )}

          </section>
        )}

        {/* RESULT */}

        {result && (
          <section
            className="result-section"
            id="result-section"
          >

            <div className="result-card">

              <div className="result-top">

                <span className="result-label">
                  <span className="result-dot" />
                  ANALYSIS COMPLETE
                </span>

                <div className="result-letter">
                  {result.letter}
                </div>

              </div>

              <div className="friend-avatars">

                <div className="avatar">
                  {getInitials(result.name1)}
                </div>

                <div className="avatar-connector">
                  <span>♥</span>
                </div>

                <div className="avatar">
                  {getInitials(result.name2)}
                </div>

              </div>

              <div className="result-icon">
                {result.icon}
              </div>

              <h2>
                {result.title}
              </h2>

              <p className="result-description">
                {result.description}
              </p>

              <div className="score-area">

                <div className="score-header">
                  <span>
                    Friendship Energy
                  </span>

                  <strong>
                    {result.score}%
                  </strong>
                </div>

                <div className="score-bar">

                  <div
                    className="score-progress"
                    style={{
                      width: `${result.score}%`,
                    }}
                  />

                </div>

              </div>

              <p className="names-result">

                {result.name1}

                <span className="heart">
                  ♥
                </span>

                {result.name2}

              </p>

              {/* DEEP ANALYSIS */}

              <div className="friendship-analysis">

                <div className="analysis-heading">

                  <div>

                    <span className="analysis-label">
                      DEEP DIVE
                    </span>

                    <h3>
                      Friendship Analysis
                    </h3>

                  </div>

                  <div className="analysis-spark">
                    ✦
                  </div>

                </div>

                <div className="metrics-grid">

                  <div className="metric-card">

                    <div className="metric-icon">
                      💜
                    </div>

                    <div className="metric-info">

                      <div className="metric-title">
                        Connection
                      </div>

                      <div className="metric-bar">
                        <span
                          style={{
                            width: `${result.score}%`,
                          }}
                        />
                      </div>

                    </div>

                    <strong>
                      {result.score}%
                    </strong>

                  </div>

                  <div className="metric-card">

                    <div className="metric-icon">
                      ✨
                    </div>

                    <div className="metric-info">

                      <div className="metric-title">
                        Energy
                      </div>

                      <div className="metric-bar">
                        <span
                          style={{
                            width: `${Math.min(
                              result.score + 2,
                              100
                            )}%`,
                          }}
                        />
                      </div>

                    </div>

                    <strong>
                      {Math.min(
                        result.score + 2,
                        100
                      )}
                      %
                    </strong>

                  </div>

                  <div className="metric-card">

                    <div className="metric-icon">
                      🤝
                    </div>

                    <div className="metric-info">

                      <div className="metric-title">
                        Trust
                      </div>

                      <div className="metric-bar">
                        <span
                          style={{
                            width: `${Math.max(
                              result.score - 3,
                              0
                            )}%`,
                          }}
                        />
                      </div>

                    </div>

                    <strong>
                      {Math.max(
                        result.score - 3,
                        0
                      )}
                      %
                    </strong>

                  </div>

                  <div className="metric-card">

                    <div className="metric-icon">
                      🌟
                    </div>

                    <div className="metric-info">

                      <div className="metric-title">
                        Memories
                      </div>

                      <div className="metric-bar">
                        <span
                          style={{
                            width: `${Math.min(
                              result.score + 4,
                              100
                            )}%`,
                          }}
                        />
                      </div>

                    </div>

                    <strong>
                      {Math.min(
                        result.score + 4,
                        100
                      )}
                      %
                    </strong>

                  </div>

                </div>

              </div>

              {/* MESSAGE */}

              <div className="friendship-message">

                <div className="message-icon">
                  💌
                </div>

                <div>

                  <span>
                    A LITTLE MESSAGE FOR YOU
                  </span>

                  <p>
                    {result.message}
                  </p>

                </div>

              </div>

              {/* ACTIONS */}

              <div className="result-actions">

                <button
                  type="button"
                  className="primary-action"
                  onClick={copyResult}
                >
                  {copied
                    ? "✓ Copied!"
                    : "📋 Copy Result"}
                </button>

                <button
                  type="button"
                  className="secondary-action"
                  onClick={shareResult}
                >
                  ↗ Share Result
                </button>

                <button
                  type="button"
                  className="reset-action"
                  onClick={resetAll}
                >
                  ↻ Try Again
                </button>

              </div>

            </div>

          </section>
        )}

        {/* MEANINGS */}

        <section className="meanings-section">

          <div className="section-heading">

            <p>
              THE SIX CONNECTIONS
            </p>

            <h2>
              What does FLAMES mean?
            </h2>

          </div>

          <div className="meaning-grid">

            {Object.entries(
              FLAMES_MEANINGS
            ).map(([letter, data]) => (

              <div
                className={`meaning-card ${
                  result?.letter === letter
                    ? "active"
                    : ""
                }`}
                key={letter}
              >

                <div className="meaning-letter">
                  {letter}
                </div>

                <div className="meaning-content">

                  <h3>
                    {data.icon} {data.title}
                  </h3>

                  <p>
                    {data.description}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </section>

        {/* FOOTER */}

        <footer className="footer">

          <div className="footer-line" />

          <p>
            FLAMES Elite is created for entertainment
            and friendship exploration. Results are
            generated for fun and should not be considered
            a scientific compatibility measurement.
          </p>

          <div className="footer-brand">

            <span>
              FLAMES ELITE
            </span>

            <small>
              v1.0
            </small>

          </div>

        </footer>

      </main>

    </div>
  );
}

export default App;

