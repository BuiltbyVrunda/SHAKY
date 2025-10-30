// sos.js
let latitude = null;
let longitude = null;

// 🔹 Get user location once page loads
window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        latitude = pos.coords.latitude;
        longitude = pos.coords.longitude;
        console.log("📍Location fetched:", latitude, longitude);
      },
      err => {
        console.warn("⚠️ Location access denied or unavailable.", err);
      }
    );
  } else {
    console.warn("❌ Geolocation not supported on this device.");
  }
};

// 🔹 Send SOS via WhatsApp + log it to backend
function sendWhatsAppSOS() {
  const emergencyMessage = `🚨 *SOS ALERT!* 🚨
Hey! This is an emergency!

📍 Location: https://maps.google.com/?q=${latitude},${longitude}
📅 Time: ${new Date().toLocaleString()}
💥 Trigger: Shake Detected`;

  // WhatsApp contact number (with country code, no + sign)
  const phoneNumber = "919876543210"; // <--- replace with your actual number

  // ✅ open WhatsApp chat with message
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(emergencyMessage)}`;
  window.open(whatsappURL, "_blank");

  // ✅ also log SOS event to local server
  fetch("http://localhost:3000/sos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user: "Vrunda", // or dynamically set
      time: new Date().toISOString(),
      intensity: "Shake Detected",
      location: { latitude, longitude }
    }),
  })
    .then(res => res.json())
    .then(data => console.log("✅ SOS logged:", data))
    .catch(err => console.error("❌ Error logging SOS:", err));
}

// 🔹 For manual test button
document.addEventListener("DOMContentLoaded", () => {
  const sosButton = document.getElementById("sosButton");
  if (sosButton) {
    sosButton.addEventListener("click", sendWhatsAppSOS);
  }
});
