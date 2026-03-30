import React, { useState } from "react";
import "./Questions.css";
import { useNavigate } from "react-router-dom";

const Questions = ({ data }) => {
  const navigate = useNavigate();

  const [activeIndex, setActiveIndex] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [score, setScore] = useState(0);

  const [currentPage, setCurrentPage] = useState(0);
  const questionsPerPage = 5;

  const startIndex = currentPage * questionsPerPage;
  const currentQuestions = data.slice(startIndex, startIndex + questionsPerPage);
  const totalPages = Math.ceil(data.length / questionsPerPage);

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleFeedback = (realIndex, type) => {
    let value = type === "correct" ? 2 : type === "partial" ? 1 : 0;

    let oldValue = 0;
    if (feedback[realIndex] === "correct") oldValue = 2;
    if (feedback[realIndex] === "partial") oldValue = 1;

    setScore(score - oldValue + value);

    setFeedback({
      ...feedback,
      [realIndex]: type,
    });
  };

  const handleAnswer = () => {
    navigate("/resultUser", {
      state: {
        totalScore: score,
        totalQuestions: data.length,
        feedback,
      },
    });
  };

  const answered = Object.keys(feedback).length;
  const progress = data.length ? (answered / data.length) * 100 : 0;

  return (
    <div className="q-container">

      {/* HEADER */}
      <div className="header">
        <h2>Interview Evaluation</h2>
        <p>Candidate Review Dashboard</p>
      </div>

      {/* 🔥 FULL WIDTH PROGRESS */}
      <div className="progress-section">
        <div className="progress-info">
          <span>Progress</span>
          <span>{answered}/{data.length}</span>
        </div>

        <div className="progress-bar">
          <div style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="content">
        {currentQuestions.map((item, index) => {
          const realIndex = startIndex + index;

          return (
            <div className="q-card" key={realIndex}>

              <div
                className="q-title"
                onClick={() => toggleAnswer(realIndex)}
              >
                <span>{realIndex + 1}. {item.question}</span>
                <span>{activeIndex === realIndex ? "▲" : "▼"}</span>
              </div>

              <div className={`q-body ${activeIndex === realIndex ? "open" : ""}`}>
                {activeIndex === realIndex && (
                  <>
                    <p className="answer">{item.answer}</p>

                    <div className="feedback">
                      <button
                        className={`chip ${feedback[realIndex] === "correct" ? "active" : ""}`}
                        onClick={() => handleFeedback(realIndex, "correct")}
                      >
                        ✔ Correct
                      </button>

                      <button
                        className={`chip ${feedback[realIndex] === "partial" ? "active" : ""}`}
                        onClick={() => handleFeedback(realIndex, "partial")}
                      >
                        ⚡ Partial
                      </button>

                      <button
                        className={`chip ${feedback[realIndex] === "wrong" ? "active" : ""}`}
                        onClick={() => handleFeedback(realIndex, "wrong")}
                      >
                        ✖ Wrong
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {/* Pagination */}
        <div className="pagination">
          <button disabled={currentPage === 0} onClick={() => setCurrentPage(currentPage - 1)}>
            ← Back
          </button>

          <span>Page {currentPage + 1} / {totalPages}</span>

          <button disabled={currentPage === totalPages - 1} onClick={() => setCurrentPage(currentPage + 1)}>
            Next →
          </button>
        </div>
      </div>

      {/* FIXED BOTTOM */}
      <div className="bottom-bar">
        <div>
          <span>Score</span>
          <h3>{score}</h3>
        </div>

        <button className="submit-btn" onClick={handleAnswer}>
          Generate Analysis →
        </button>
      </div>

    </div>
  );
};

export default Questions;