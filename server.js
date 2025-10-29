import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Parser } from "json2csv";

const app = express();
const port = 3000;

// ES module path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, "shake_data.json");

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// 🟢 Log incoming shake data
app.post("/shake", (req, res) => {
  const { time, intensity } = req.body;

  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  data.push({ time, intensity: parseFloat(intensity) });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

  console.log("Shake logged:", { time, intensity });
  res.json({ message: "Shake logged successfully!" });
});

// 🟢 Endpoint to view all shake data
app.get("/data", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  res.json(data);
});

// 🟢 Endpoint to download data as JSON
app.get("/download/json", (req, res) => {
  res.download(DATA_FILE, "shake_data.json");
});

// 🟢 Endpoint to download data as CSV
app.get("/download/csv", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  if (data.length === 0) return res.status(404).send("No shake data found.");

  const parser = new Parser({ fields: ["time", "intensity"] });
  const csv = parser.parse(data);

  const csvPath = path.join(__dirname, "shake_data.csv");
  fs.writeFileSync(csvPath, csv);
  res.download(csvPath, "shake_data.csv");
});

// 🟢 Start the server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
  console.log(`📊 View shake data at http://localhost:${port}/data`);
  console.log(`⬇️  Download JSON: http://localhost:${port}/download/json`);
  console.log(`⬇️  Download CSV:  http://localhost:${port}/download/csv`);
});
