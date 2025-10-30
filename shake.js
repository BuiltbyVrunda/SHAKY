// shake.js
import { sendWhatsAppSOS } from "./sos.js";

let lastShakeTime = 0;
let shakeThreshold = 15; // Adjust sensitivity (lower = more sensitive)
let statusEl;

// Ask permission for motion sensors on iOS/Android
async function requestMotionPermission() {
  if (typeof DeviceMotionEvent.requestPermission === "function") {
    try {
      const response = await DeviceMotionEvent.requestPermission();
      if (response === "granted") {
        initShakeDetection();
      } else {
        alert("Permission denied. Please allow motion access in settings.");
      }
    } catch (err) {
      console.error("Error requesting motion permission:", err);
    }
  } else {
    // For Android / non-iOS browsers
    initShakeDetection();
  }
}

function initShakeDetection() {
  window.addEventListener("devicemotion", event => {
    const { x, y, z } = event.accelerationIncludingGravity;
    const totalAcceleration = Math.sqrt(x * x + y * y + z * z);

    if (totalAcceleration > shakeThreshold) {
      const now = Date.now();
      if (now - lastShakeTime > 2000) {
        lastShakeTime = now;
        console.log("🚨 Shake detected! Sending SOS...");
        statusEl.textContent = "🚨 Shake detected! Sending SOS...";
        sendWhatsAppSOS();
      }
    }
  });

  statusEl.textContent = "✅ Motion sensors active. Shake to trigger SOS.";
}

document.addEventListener("DOMContentLoaded", () => {
  statusEl = document.getElementById("status");
  statusEl.textContent = "⚙️ Waiting for motion sensor permission...";

  const enableButton = document.createElement("button");
  enableButton.textContent = "Enable Motion Sensors";
  enableButton.className =
    "bg-green-600 text-white px-4 py-2 rounded mt-2 hover:bg-green-700";
  enableButton.addEventListener("click", requestMotionPermission);

  document.body.appendChild(enableButton);
});
