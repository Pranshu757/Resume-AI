import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Result.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

const Result = ({userName}) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const reportRef = useRef();

  if (!state) return <h2>No Data Found</h2>;

  const { totalScore, totalQuestions, feedback, name } = state;

  const maxScore = totalQuestions * 2;
  const percentage = ((totalScore / maxScore) * 100).toFixed(1);

  let status = "";
  let tag = "";

  if (percentage >= 75) {
    status = "Selected";
    tag = "selected";
  } else if (percentage >= 50) {
    status = "Consider";
    tag = "consider";
  } else {
    status = "Rejected";
    tag = "rejected";
  }

  let correct = 0,
    partial = 0,
    wrong = 0;

  Object.values(feedback).forEach((f) => {
    if (f === "correct") correct++;
    else if (f === "partial") partial++;
    else wrong++;
  });

  const data = [
    { name: "Correct", value: correct },
    { name: "Partial", value: partial },
    { name: "Wrong", value: wrong },
  ];

  // ✅ AI Feedback (5–6 lines)
  const getEvaluation = () => {
    if (percentage >= 75) {
      return `The candidate demonstrates strong problem-solving ability and clear understanding of concepts. 
Performance is consistent across most questions. 
Shows structured thinking and good communication. 
Capable of handling real-world scenarios efficiently. 
Requires minimal supervision. 
Highly recommended for the role.`;
    } else if (percentage >= 50) {
      return `The candidate has a basic understanding of core concepts. 
Performance is somewhat inconsistent. 
Some answers show partial clarity. 
Needs improvement in advanced topics. 
Can grow with guidance and training. 
Suitable for junior roles.`;
    } else {
      return `The candidate struggles with fundamental concepts. 
Problem-solving approach lacks clarity. 
Multiple incorrect responses observed. 
Low consistency across answers. 
Needs significant improvement. 
Not recommended for the role currently.`;
    }
  };

  const downloadPDF = async () => {
    const canvas = await html2canvas(reportRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape");
    pdf.addImage(imgData, "PNG", 10, 10, 270, 150);
    pdf.save("Candidate_Report.pdf");
  };

  return (
    <div className="page">

      {/* 🔹 Navbar */}
      <div className="navbar">
        <div className="nav-center">
          <h2>{userName || "Candidate Name"}</h2>
          <p>Web Developer</p>
        </div>
      </div>

      {/* 🔹 Main */}
      <div className="main" ref={reportRef}>

        {/* LEFT */}
        <div className="left">

          <div className="card">
            <div className={`badge ${tag}`}>{status}</div>

            <h1>{percentage}%</h1>
            <p>Match Score</p>

            <div className="grid">
              <div>{totalScore}<span>Score</span></div>
              <div>{totalQuestions}<span>Questions</span></div>
            </div>

            <div className="progress-bar">
              <div style={{ width: `${percentage}%` }}></div>
            </div>

            <div className="breakdown">
              {/* ✔ {correct} ⚡ {partial} ✖ {wrong} */}
              <span>Correct: {correct} Partial: {partial} Wrong: {wrong}</span>
            </div>
          </div>

          <div className="card small">
            <h3>Evaluation</h3>
            <p>{getEvaluation()}</p>
          </div>

        </div>

        {/* RIGHT */}
        <div className="right">

          <div className="card chart">
            <h3>Performance Breakdown</h3>

            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                >
                  {data.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="legend">
              <div><span className="dot green"></span> Correct ({correct})</div>
              <div><span className="dot yellow"></span> Partial ({partial})</div>
              <div><span className="dot red"></span> Wrong ({wrong})</div>
            </div>

            {/* Description */}
            <p className="chart-desc">
              This chart shows the distribution of correct, partial, and incorrect answers. 
              A larger green section indicates strong performance, while red highlights areas needing improvement.
            </p>

          </div>

        </div>

      </div>

      {/* 🔹 Footer */}
      <div className="footer">
        <button onClick={() => navigate("/")}>Dashboard</button>
        <button className="primary" onClick={downloadPDF}>
          Download Report
        </button>
      </div>

    </div>
  );
};

export default Result;