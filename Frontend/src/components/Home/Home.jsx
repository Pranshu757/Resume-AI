import React, { useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = ({setuserName}) => {
  const navigate = useNavigate();

  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!resumeFile || !jobDescription.trim()) {
      setAnalysisResult("Please upload resume and enter job description.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);

    try {
      setLoading(true);
      setAnalysisResult("");

      const res = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      // ✅ safety check
      if (!data.result) {
        setAnalysisResult("Invalid response from server");
        return;
      }

      setuserName(data.result[0]);

      // ✅ direct array pass

      navigate("/result", { state: data.result });

    } catch (error) {
      console.error(error);
      setAnalysisResult("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">

        {loading && (
    <div className="loader-overlay">
      <div className="loader-content">
        <div className="loader"></div>
        <p>Analyzing your resume...</p>
      </div>
    </div>
  )}
      
      {/* Navbar */}
      <nav className="navbar">
        <div className="brand">Resume AI</div>
      </nav>

      {/* Main */}
      <div className="container">
        <div className="card">
          <h1>Resume AI Analyzer</h1>
          <p>
            Upload your resume and paste job description to analyze matching
            and prepare for interviews.
          </p>

          {/* File Upload */}
          <div className="input-box">
            <label>Upload Resume</label>
            <input type="file" onChange={handleFileChange} />
            {resumeFile && <span>{resumeFile.name}</span>}
          </div>

          {/* Job Description */}
          <div className="input-box">
            <label>Job Description</label>
            <textarea
              rows="6"
              placeholder="Paste job description..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          {/* Button */}
          <button className="analyze-btn" onClick={handleAnalyze}>
            {loading ? "Analyzing..." : "Analyze"}
          </button>


    
          {/* Error */}
          {analysisResult && (
            <div className="result">{analysisResult}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;