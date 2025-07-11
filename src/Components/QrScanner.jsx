

// QRScanner.jsx
import React, { useRef, useState } from "react";

function QRScanner() {
  const videoRef = useRef(null);
  const [error, setError] = useState("");
  const [hasCameraAccess, setHasCameraAccess] = useState(false);

  const requestCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraAccess(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Camera access denied or not available.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>QR Scanner</h2>

      {!hasCameraAccess ? (
        <button onClick={requestCameraAccess} style={{ padding: "10px 20px", fontSize: "16px" }}>
          Request Camera Access
        </button>
      ) : (
        <video ref={videoRef} autoPlay playsInline style={{ width: "100%", maxWidth: 400 }} />
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default QRScanner;

