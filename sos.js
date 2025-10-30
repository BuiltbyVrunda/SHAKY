// sos.js
export async function sendWhatsAppSOS() {
  console.log("📡 SOS triggered!");

  const statusEl = document.getElementById("status");
  statusEl.textContent = "📍 Getting location...";

  // 1️⃣ Get user location
  let location = { latitude: "Unknown", longitude: "Unknown" };
  try {
    const pos = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
      });
    });
    location = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    };
    console.log("📍 Location fetched:", location);
  } catch (err) {
    console.warn("⚠️ Location not available:", err.message);
  }

  // 2️⃣ Create SOS message
  const user = "User123"; // (you can make this dynamic)
  const time = new Date().toLocaleString();
  const message = `
🚨 *SOS Alert!*
User: ${user}
Time: ${time}
Location: https://www.google.com/maps?q=${location.latitude},${location.longitude}
`.trim();

  // 3️⃣ Send data to your Node server
  try {
    await fetch("http://localhost:3000/sos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user,
        time: new Date().toISOString(),
        triggeredBy: "Shake",
        location,
      }),
    });
    console.log("✅ SOS logged on server");
  } catch (err) {
    console.error("❌ Failed to send to server:", err);
  }

  // 4️⃣ Open WhatsApp message (this sends via WhatsApp)
  const encodedMessage = encodeURIComponent(message);
  const phoneNumber = "919361916131"; // Replace with your emergency number
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  window.open(whatsappURL, "_blank");

  // 5️⃣ Update status
  statusEl.textContent = "✅ SOS sent via WhatsApp!";
}
