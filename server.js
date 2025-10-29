import express from "express";
import fs from "fs";
import path from "path";

const app = express();
app.use(express.json());

const DATA_FILE = path.join(process.cwd(), "shake_data.json");
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");

app.post("/shake", (req, res) => {
  const { time, intensity } = req.body;
  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  data.push({ time, intensity });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  console.log("💾 Logged shake:", { time, intensity });
  res.json({ success: true });
});

app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);
