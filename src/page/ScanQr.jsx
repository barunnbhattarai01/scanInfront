// ScanQr.jsx
import React, { useState } from "react";
import QRScanner from "../Components/QrScanner";

function ScanQr() {
  const [scannedText, setScannedText] = useState("");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h2>QR Scanner Loaded</h2>
      <QRScanner onScanSuccess={(text) => setScannedText(text)} />
      {scannedText && (
        <div style={{ marginTop: "20px", fontSize: "18px", color: "green" }}>
          <strong>Scanned QR:</strong> {scannedText}
        </div>
      )}
    </div>
  );
}

export default ScanQr;

