const emergencyNumber = "919361916131"; // <-- Your WhatsApp number (without +)
let motionEnabled = false;
let shakeEvent;
const statusText = document.getElementById("status");

document.getElementById("enableMotion").onclick = async () => {
  try {
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      const permission = await DeviceMotionEvent.requestPermission();
      if (permission === "granted") {
        motionEnabled = true;
        startShakeDetection();
        statusText.innerText = "✅ Motion detection enabled!";
      } else {
        statusText.innerText = "❌ Motion permission denied.";
      }
    } else {
      motionEnabled = true;
      startShakeDetection();
      statusText.innerText = "✅ Motion detection active (auto)";
    }
  } catch (err) {
    statusText.innerText = "Error: " + err.message;
  }
};

function startShakeDetection() {
  shakeEvent = new Shake({ threshold: 15, timeout: 1000 });
  shakeEvent.start();

  window.addEventListener("shake", () => {
    if (!motionEnabled) return;
    alert("🚨 Shake detected! Sending SOS via WhatsApp...");
    sendWhatsAppSOS();
  });
}

document.getElementById("sendSOS").onclick = () => {
  sendWhatsAppSOS();
};

function sendWhatsAppSOS() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const locationLink = `https://maps.google.com/?q=${latitude},${longitude}`;
        const message = encodeURIComponent(
          `🚨 *SOS ALERT* 🚨\n\nI'm in danger! Please help me.\nMy live location: ${locationLink}`
        );
        window.open(`https://wa.me/${emergencyNumber}?text=${message}`, "_blank");
      },
      (err) => {
        const message = encodeURIComponent(
          `🚨 *SOS ALERT* 🚨\n\nI'm in danger! Location not available.`
        );
        window.open(`https://wa.me/${emergencyNumber}?text=${message}`, "_blank");
      }
    );
  } else {
    const message = encodeURIComponent(
      `🚨 *SOS ALERT* 🚨\n\nI'm in danger! (No location support)`
    );
    window.open(`https://wa.me/${emergencyNumber}?text=${message}`, "_blank");
  }
}
