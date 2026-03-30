import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ---------- MULTER SETUP ---------- */
const upload = multer({
  dest: "uploads/",
});

/* ---------- GEMINI SETUP ---------- */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* ---------- API ---------- */
app.post("/analyze", upload.single("resume"), async (req, res) => {
  let filePath;
  try {
    // ✅ Validate inputs
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    const jobDescription = req.body.jobDescription;
    if (!jobDescription) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "Job description is required" });
    }

    filePath = req.file.path;

    // ✅ Read PDF
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);

    const resumeText = pdfData.text;

    // ✅ Prompt
    const prompt = `
You are a Resume AI Analyzer.

Return ONLY JSON array:

[
  "Name",
  "Experience",
  MatchScore,
  ["Job Skills"],
  ["Job Description Skills],
  ["Project Points in short"],
  ["Education"],
  ["Achievements"]
]

Rules:
- ONLY JSON
- No explanation
- MatchScore must be number (0-100)

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

    // ✅ Gemini Call
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    // ✅ Clean JSON (important ⚠️)
    let clean = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(clean);
    } catch (err) {
      if (filePath) fs.unlinkSync(filePath);
      return res.status(500).json({
        error: "Invalid JSON from Gemini",
        raw: clean,
      });
    }

    // ✅ send array
    res.json({ result: parsed });

  } catch (error) {
    // ✅ Clean up file on error
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    console.error(error);
    res.status(500).json({
      error: "Server Error",
      details: error.message,
    });
  }
});



//2
app.post("/interview", async (req, res) => {
  try {
    const { skills, round, experience } = req.body;

    // ✅ Validation
    if (!skills || skills.length === 0) {
      return res.status(400).json({ error: "Skills required" });
    }

    if (!round) {
      return res.status(400).json({ error: "Round type required" });
    }

    // ✅ Prompt (Dynamic based on round)
    let prompt = "";

   if (round === "technical1" || round === "technical2") {
  prompt = `
  You are a technical interviewer.

  Candidate Experience: ${experience}
  Skills: ${skills.join(", ")}

  Generate:
  - 5 easy
  - 5 medium
  - 5 hard technical interview questions

  Return ONLY JSON in this format:
  [
    {
      "question": "...",
      "answer": "..."
    }
  ]

  Rules:
  - Questions should be based on skills
  - Provide concise but correct answers
  - No explanation outside JSON
  `;
}

    if (round === "hr") {
  prompt = `
  You are an HR interviewer.

  Candidate Experience: ${experience}

  Generate 5 easy 5 medium/hard HR interview questions with answers.

  Return ONLY JSON:
  [
    {
      "question": "...",
      "answer": "..."
    }
  ]

  Rules:
  - Behavioral + HR questions only
  - Answers should be sample ideal responses
  - No explanation outside JSON
  `;
}

    // ✅ Gemini Call
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    // ✅ Clean JSON
    let clean = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(clean);
    } catch (err) {
      return res.status(500).json({
        error: "Invalid JSON from Gemini",
        raw: clean,
      });
    }

    // ✅ Send only selected round questions
    res.json({
      questions: parsed
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server Error",
      details: error.message,
    });
  }
});

/* ---------- SERVER ---------- */
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});