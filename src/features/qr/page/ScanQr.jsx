import React, { useState, useEffect } from "react";
import QRScanner from "../components/QrScanner";
import useUserInfo from "../../common/hooks/useUserInfo";

function ScanQr() {
  const [scannedText, setScannedText] = useState("");
  const { user, loading } = useUserInfo();

  useEffect(() => {
    if (loading == false) {
      console.log(user);

      if (!user) {
        navigate("/login", { replace: true });
      }
    }
  }, [user, loading]);

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
