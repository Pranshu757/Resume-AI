import fs from "fs";
import FormData from "form-data";
import fetch from "node-fetch";

const pdfPath = "uploads/sample-resume.pdf";

const jobDescription = `
  Senior Software Engineer
  Requirements:
  - 5+ years of experience with Node.js and JavaScript
  - Experience with React, Express, and relational databases
  - Strong problem-solving and communication skills
  - Experience with REST APIs and microservices
`;

async function testAPI() {
  try {
    // ✅ Read the PDF file
    if (!fs.existsSync(pdfPath)) {
      console.error("❌ PDF file not found. Run: node generate-sample.js");
      return;
    }

    // ✅ Create form data
    const form = new FormData();
    form.append("resume", fs.createReadStream(pdfPath));
    form.append("jobDescription", jobDescription);

    // ✅ Make request
    const response = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      body: form,
      headers: form.getHeaders(),
    });

    const result = await response.json();
    console.log("✅ API Response:");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testAPI();
