import PDFDocument from "pdfkit";
import fs from "fs";

// ✅ Create a sample resume PDF
const doc = new PDFDocument({
  size: "A4",
  margin: 50,
});

const pdfPath = "uploads/sample-resume.pdf";

// Create uploads folder if it doesn't exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const pdfStream = fs.createWriteStream(pdfPath);

doc.pipe(pdfStream);

// Simple content
doc.fontSize(24).text("JOHN DOE");
doc.fontSize(12).text("Senior Software Engineer");
doc.text("Email: john.doe@example.com | Phone: (555) 123-4567");

doc.moveDown();
doc.fontSize(14).text("PROFESSIONAL SUMMARY");
doc.fontSize(11).text(
  "Experienced software engineer with 8 years of full-stack development experience using Node.js, React, Express, and relational databases like PostgreSQL. Proven track record of building scalable microservices and leading technical teams."
);

doc.moveDown();
doc.fontSize(14).text("WORK EXPERIENCE");

doc.fontSize(12).text("Senior Developer at Tech Corp (2020-Present)");
doc.fontSize(11).text("Led development of Node.js-based microservices architecture. Managed React frontend team. Implemented PostgreSQL database solutions for high-traffic applications.", {
  indent: 20,
});

doc.moveDown();
doc.fontSize(12).text("Full Stack Developer at Digital Solutions Inc (2018-2020)");
doc.fontSize(11).text("Built RESTful APIs using Express.js. Developed React frontends. Optimized database queries.", {
  indent: 20,
});

doc.moveDown();
doc.fontSize(14).text("TECHNICAL SKILLS");
doc.fontSize(11).text("Languages: JavaScript, TypeScript, Python, SQL");
doc.fontSize(11).text("Backend: Node.js, Express.js, REST APIs");
doc.fontSize(11).text("Frontend: React, Next.js, HTML, CSS");
doc.fontSize(11).text("Databases: PostgreSQL, MongoDB, Redis");
doc.fontSize(11).text("Tools & DevOps: Git, Docker, AWS, CI/CD");

doc.moveDown();
doc.fontSize(14).text("EDUCATION");
doc.fontSize(11).text("Bachelor of Science in Computer Science - State University (2016)");
doc.fontSize(11).text("GPA: 3.8/4.0");

doc.end();

pdfStream.on("finish", () => {
  console.log("✅ Sample PDF created at:", pdfPath);
});

pdfStream.on("error", (err) => {
  console.error("❌ Error creating PDF:", err);
});
