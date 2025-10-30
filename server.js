import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const sosFile = "sos_log.json";

function saveData(filename, data) {
  const existing = fs.existsSync(filename)
    ? JSON.parse(fs.readFileSync(filename, "utf8"))
    : [];
  existing.push(data);
  fs.writeFileSync(filename, JSON.stringify(existing, null, 2));
}

// POST /sos → for SOS event
app.post("/sos", (req, res) => {
  const data = { ...req.body, type: "SOS_TRIGGER" };
  saveData(sosFile, data);
  console.log("🚨 SOS event logged:", data);
  res.json({ status: "SOS logged" });
});

// POST /sos-live → for continuous location updates
app.post("/sos-live", (req, res) => {
  const data = { ...req.body, type: "LIVE_UPDATE" };
  saveData(sosFile, data);
  console.log("📍 Live location update:", data);
  res.json({ status: "Live location logged" });
});

app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));
