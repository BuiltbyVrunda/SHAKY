let permissionGranted = false;
let sosTimeout = null;
let emergencyNumber = "919361916131"; // your WhatsApp contact number (without +)
let userLocation = "Location not available";

async function requestMotionPermission() {
  if (typeof DeviceMotionEvent.requestPermission === "function") {
    try {
      const response = await DeviceMotionEvent.requestPermission();
      if (response === "granted") {
        permissionGranted = true;
        document.getElementById("status").textContent = "✅ Motion access granted!";
        startShakeListener();
      } else {
        alert("Please allow motion access for this feature to work.");
      }
    } catch (err) {
      console.error("Permission error:", err);
    }
  } else {
    // For Android
    permissionGranted = true;
    document.getElementById("status").textContent = "✅ Motion access not required on this device.";
    startShakeListener();
  }
}

function startShakeListener() {
  const myShakeEvent = new Shake({
    threshold: 15, // sensitivity (lower = more sensitive)
    timeout: 1000
  });
  myShakeEvent.start();

  window.addEventListener('shake', () => {
    if (!permissionGranted) return;
    console.log("💥 Shake detected!");
    document.body.style.backgroundColor = "#ffaaaa";
    showSOSCountdown();
    setTimeout(() => (document.body.style.backgroundColor = "white"), 500);
  }, false);
}

function showSOSCountdown() {
  alert("🚨 Shake detected! SOS will trigger in 3 seconds unless cancelled.");

  const sosBtn = document.getElementById("sosButton");
  sosBtn.style.display = "inline-block";
  sosBtn.textContent = "🚨 Cancel SOS";

  sosTimeout = setTimeout(triggerSOS, 3000);

  sosBtn.onclick = () => {
    clearTimeout(sosTimeout);
    sosBtn.style.display = "none";
    alert("✅ SOS cancelled.");
  };
}

async function triggerSOS() {
  document.getElementById("sosButton").style.display = "none";
  document.getElementById("status").textContent = "🚨 Sending SOS message...";

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        userLocation = `https://maps.google.com/?q=${latitude},${longitude}`;
        sendWhatsAppMessage(userLocation);
      },
      () => {
        sendWhatsAppMessage("Location not available");
      }
    );
  } else {
    sendWhatsAppMessage("Location not available");
  }
}

function sendWhatsAppMessage(location) {
  const message = encodeURIComponent(
    `🚨 EMERGENCY ALERT 🚨\n\nShake detected on user's phone!\nLocation: ${location}`
  );
  const whatsappURL = `https://wa.me/${emergencyNumber}?text=${message}`;
  window.open(whatsappURL, "_blank");
  document.getElementById("status").textContent = "✅ SOS message opened in WhatsApp!";
}

document.getElementById("enableMotion").addEventListener("click", requestMotionPermission);
