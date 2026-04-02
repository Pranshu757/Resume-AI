## Resume AI Analyzer

Resume AI is a full-stack web application that analyzes a user's resume against a job description using AI and provides insights like match score, skills, and interview readiness.

---

### Features

* Upload Resume (PDF)
* Enter Job Description
* AI-based Resume Analysis (using Gemini API)
* Match Score (0–100%)
* Extracted Skills
* Project Highlights
* Education Details
* Achievements
* Interview Question Flow
* Result Dashboard with Performance Feedback

---

### Tech Stack

**Frontend:**

* React.js
* CSS (Responsive UI)
* React Router

**Backend:**

* Node.js
* Express.js
* Multer (File Upload)
* pdf-parse (Resume Text Extraction)

**AI Integration:**

* Google Gemini API

---

### How It Works

1. User uploads a resume and enters a job description.
2. Backend extracts text from the PDF using pdf-parse.
3. A structured prompt is sent to Gemini AI.
4. AI returns data in JSON array format.
5. Backend cleans and parses the response.
6. Frontend displays:

   * Match score
   * Skills
   * Experience
   * Education
   * Achievements
7. User can also attempt interview questions and get a performance report.

---

### Key Logic

* AI response is strictly formatted into JSON for easy UI rendering.
* Error handling ensures invalid AI responses are auto-corrected.
* Score calculation is based on user answers:

  * Correct = 2 points
  * Partial = 1 point
* Percentage is dynamically calculated and shown in result dashboard.

---

### 📊 Example Output

```json
[
  "Pranshu",
  "1 year",
  95,
  ["Node.js","React"],
  ["Built REST APIs","Auth system"],
  ["MCA"],
  ["600+ DSA solved"]
]
```

---

### Highlights

* Real-world AI integration project
* Full-stack implementation
* Clean UI with dashboard visualization
* Handles edge cases (invalid JSON, PDF errors)
* Interview-ready project

---

### Future Improvements

* Add authentication (login/signup)
* Save analysis history (MongoDB)
* Export report as PDF
* Improve AI accuracy using schema-based responses

---

###  Use Case

* Helps job seekers evaluate resume strength
* Improves ATS compatibility
* Prepares users for interviews with insights

---
