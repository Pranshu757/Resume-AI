import React, { useState, useEffect } from "react";
import "./Interview.css";
import { useNavigate } from "react-router-dom";

const Interview = ({ setdata }) => {
  const navi = useNavigate();

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedRound, setSelectedRound] = useState("technical1");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);

  const skills = [
    "JavaScript", "React", "Node.js", "Python",
    "Java", "SQL", "HTML", "CSS"
  ];

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  const handleSubmit = async () => {
    if (selectedSkills.length === 0 || !experience.trim()) {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      skills: selectedSkills,
      round: selectedRound,
      experience: experience,
    };

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      setdata(data.questions);
      navi("/questions");

    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Disable scroll when loading
  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "auto";
  }, [loading]);

  return (
    <div className="interview-container">

      {/* 🔥 LOADER OVERLAY */}
      {loading && (
        <div className="loader-overlay">
          <div className="loader-content">
            <div className="loader"></div>
            <p>Generating Interview Questions...</p>
          </div>
        </div>
      )}

      <h1>Interview Setup</h1>

      {/* EXPERIENCE */}
      <div className="section">
        <h3>Experience</h3>
        <input
          type="text"
          placeholder="e.g. 2 years"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="input"
        />
      </div>

      {/* SKILLS */}
      <div className="section">
        <h3>Select Skills</h3>
        <div className="skills">
          {skills.map((skill, i) => (
            <span
              key={i}
              className={`skill ${selectedSkills.includes(skill) ? "active" : ""}`}
              onClick={() => toggleSkill(skill)}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* ROUND */}
      <div className="section">
        <h3>Select Round</h3>
        <div className="options">
          <button
            className={selectedRound === "technical1" ? "active" : ""}
            onClick={() => setSelectedRound("technical1")}
          >
            Technical Round 1
          </button>

          <button
            className={selectedRound === "technical2" ? "active" : ""}
            onClick={() => setSelectedRound("technical2")}
          >
            Technical Round 2
          </button>

          <button
            className={selectedRound === "hr" ? "active" : ""}
            onClick={() => setSelectedRound("hr")}
          >
            HR Round
          </button>
        </div>
      </div>

      {/* SUBMIT */}
      <button
        className="submit-btn"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Starting..." : "Start Interview"}
      </button>

    </div>
  );
};

export default Interview;