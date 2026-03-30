import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./UserInfo.css";


const UserInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  if (!data) return <h2 className="no-data">No Data Found</h2>;

  const [
    name,
    experience,
    matchScore,
    jobSkills,
    jdSkills,
    projects,
    education,
    achievements,
  ] = data;

  return (
    <div className="page">

      {/* TOP RIGHT BUTTON (FLOATING) */}
      <button 
        className="interview-btn"
        onClick={() => navigate("/interview")}
      >
        Conduct Interview
      </button>

      {/* MAIN CONTENT */}
      <div className="container">

        {/* HEADER */}
        <div className="header">
          <h1>{name}</h1>
          <p>{experience}</p>
        </div>

        {/* SCORE */}
        <div className="score-section">
          <div
            className="score-circle"
            style={{
              background: `conic-gradient(#2563eb ${matchScore * 3.6}deg, #e5e7eb 0deg)`
            }}
          >
            <div className="inner-circle">
              {matchScore}%
            </div>
          </div>
          <p>Resume Match Score</p>
        </div>

        {/* CARDS */}
        <div className="cards">

          <div className="card">
            <h3>Job Skills</h3>
            <div className="tags">
              {jobSkills.map((skill, i) => (
                <span key={i}>{skill}</span>
              ))}
            </div>
          </div>

          <div className="card">
            <h3>Job Description Skills</h3>
            <div className="tags">
              {jdSkills.map((skill, i) => (
                <span key={i}>{skill}</span>
              ))}
            </div>
          </div>

          <div className="card">
            <h3>Projects</h3>
            <ul>
              {projects.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h3>Education</h3>
            <ul>
              {education.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h3>Achievements</h3>
            <ul>
              {achievements.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserInfo;