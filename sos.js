let motionEnabled = false;
let lastShakeTime = 0;
let pendingSOS = false;
const statusText = document.getElementById("status");

document.getElementById("enableMotion").onclick = async () => {
  try {
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      const permission = await DeviceMotionEvent.requestPermission();
      if (permission === "granted") {
        motionEnabled = true;
        statusText.innerText = "✅ Motion detection enabled.";
      } else {
        statusText.innerText = "❌ Motion permission denied.";
      }
    } else {
      motionEnabled = true;
      statusText.innerText = "✅ Motion detection active (no permission needed).";
    }

    const myShakeEvent = new Shake({ threshold: 15, timeout: 1000 });
    myShakeEvent.start();

    window.addEventListener("shake", () => {
      if (!motionEnabled) return;
      const now = Date.now();
      if (now - lastShakeTime < 5000) return; // avoid spam
      lastShakeTime = now;

      alert("Shake detected! You have 3 seconds to cancel SOS.");
      pendingSOS = true;

      setTimeout(() => {
        if (pendingSOS) {
          sendSOS("shake");
        }
      }, 3000);
    });
  } catch (err) {
    alert("Error enabling motion: " + err);
  }
};

document.getElementById("sosBtn").onclick = () => {
  sendSOS("manual");
};

async function sendSOS(triggeredBy) {
  pendingSOS = false;
  statusText.innerText = "🚨 Sending SOS...";

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const data = {
      user: "Vrunda",
      time: Date.now(),
      triggeredBy,
      intensity: triggeredBy === "shake" ? "High" : "Manual",
      location: {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      },
    };

    try {
      const res = await fetch("http://localhost:3000/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      statusText.innerText = "✅ SOS Sent!";
      console.log("✅ SOS Response:", json);
    } catch (err) {
      statusText.innerText = "❌ Failed to send SOS.";
      console.error(err);
    }
  }, (err) => {
    alert("Location access required for SOS: " + err.message);
  });
}
