import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

// ES module path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to parse JSON data
app.use(express.json());

// Serve static files (index.html, shake.js)
app.use(express.static(__dirname));

// Endpoint to handle shake data
app.post("/shake", (req, res) => {
  const shakeData = req.body;
  const filePath = path.join(__dirname, "shake_data.json");

  // Read existing file or initialize empty array
  let data = [];
  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }

  // Add new shake record
  data.push({
    time: shakeData.time,
    intensity: shakeData.intensity,
  });

  // Write back to file
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log("Shake logged:", shakeData);

  res.json({ message: "Shake logged successfully!" });
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
