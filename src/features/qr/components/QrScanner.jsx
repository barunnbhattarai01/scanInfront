import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

function QRScanner({ onScanSuccess }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      }
    );

    scanner.render(
      (decodedText) => {
        if (onScanSuccess) onScanSuccess(decodedText);
      },
      (errorMessage) => {
        // Optional: handle error
      }
    );

    return () => {
      scanner.clear().catch((error) => console.error("Clear failed:", error));
    };
  }, [onScanSuccess]);

  return <div id="qr-reader" style={{ width: "300px" }} />;
}

export default QRScanner;
