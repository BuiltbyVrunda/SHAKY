import express from "express";
import fs from "fs";
import cors from "cors";
import twilio from "twilio"; // SMS service

const app = express();
app.use(cors());
app.use(express.json());

const sosFile = "sos_log.json";

// ✅ Add your Twilio credentials here
const accountSid = "YOUR_TWILIO_ACCOUNT_SID";
const authToken = "YOUR_TWILIO_AUTH_TOKEN";
const twilioClient = twilio(accountSid, authToken);

// Your Twilio phone number
const twilioNumber = "+1234567890";

// Emergency contacts (you can later store this in a DB)
const emergencyContacts = [
  { name: "Mom", phone: "+91XXXXXXXXXX" },
  { name: "Dad", phone: "+91YYYYYYYYYY" },
  { name: "Friend", phone: "+91ZZZZZZZZZZ" },
];

// Helper function to log data
function saveData(filename, data) {
  const existing = fs.existsSync(filename)
    ? JSON.parse(fs.readFileSync(filename, "utf8"))
    : [];
  existing.push(data);
  fs.writeFileSync(filename, JSON.stringify(existing, null, 2));
}

// ✅ SOS route
app.post("/sos", async (req, res) => {
  const { user, time, triggeredBy, intensity, location } = req.body;
  const sosDetails = {
    user,
    time,
    triggeredBy,
    intensity,
    location,
    type: "SOS_TRIGGER",
  };

  saveData(sosFile, sosDetails);
  console.log("🚨 SOS logged:", sosDetails);

  const messageText = `
🚨 SOS Alert!
User: ${user}
Trigger: ${triggeredBy}
Time: ${new Date(time).toLocaleString()}
${intensity ? `Shake Intensity: ${intensity}\n` : ""}
Location: https://www.google.com/maps?q=${location.latitude},${location.longitude}
`;

  // ✅ Send SMS to all emergency contacts
  for (const contact of emergencyContacts) {
    try {
      await twilioClient.messages.create({
        body: messageText,
        from: twilioNumber,
        to: contact.phone,
      });
      console.log(`📩 SOS sent to ${contact.name} (${contact.phone})`);
    } catch (err) {
      console.error(`❌ Failed to send to ${contact.name}:`, err.message);
    }
  }

  res.json({ status: "SOS sent to emergency contacts" });
});

// ✅ Route to log live location updates
app.post("/sos-live", (req, res) => {
  const data = { ...req.body, type: "LIVE_UPDATE" };
  saveData(sosFile, data);
  console.log("📍 Live location:", data.location);
  res.json({ status: "Live location logged" });
});

app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));
