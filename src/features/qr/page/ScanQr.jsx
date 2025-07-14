import React, { useEffect, useState } from "react";
import QRScanner from "../components/QrScanner";
import { useParams } from "react-router-dom";
import { BACKENDURL } from "../../../configuration";

function ScanQr() {
  const [scannedText, setScannedText] = useState("");
  const { activityId } = useParams();

  async function onClick(attendeeId) {
    const respose = await fetch(BACKENDURL + "/checkins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        attendee_id: attendeeId,
        activity_id: activityId,
        scanned_at: "2025-07-08T15:30:00Z", //todo change to time.now()
        status: "checked",
        scanned_by: "random person"
      }),
    })
    if (respose.ok) {
      alert("Sucess")
      return
    }
    alert("Failed")
  }
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
      <QRScanner onScanSuccess={(text) => onClick(text)} />
    </div>
  );
}

export default ScanQr;

