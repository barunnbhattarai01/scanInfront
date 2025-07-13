import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

function QRCodeGenerator({ text }) {
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    if (!text) {
      setQrUrl("");
      return;
    }

    QRCode.toDataURL(text)
      .then((url) => {
        setQrUrl(url);
      })
      .catch((err) => {
        console.error("QR generation failed", err);
        setQrUrl("");
      });
  }, [text]);

  return (
    <div style={{ marginTop: 10 }}>
      {qrUrl ? <img src={qrUrl} alt="QR Code" /> : <p>Generating...</p>}
    </div>
  );
}

export default QRCodeGenerator;
