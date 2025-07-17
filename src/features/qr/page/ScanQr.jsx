import { useState, useEffect } from "react";
import QRScanner from "../components/QrScanner";
import { useNavigate, useParams } from "react-router-dom";
import { BACKENDURL } from "../../../configuration";
import useUserInfo from "../../common/hooks/useUserInfo";
import { useNavigate } from "react-router-dom";


function ScanQr() {

  const { user, loading, jwt } = useUserInfo();
  const { activityId } = useParams();
  const navigate = useNavigate()


  useEffect(() => {
    if (loading == false) {
      console.log(user);
      if (!user) {
        navigate("/login", { replace: true });
      }
    }
  }, [user, loading]);

  async function onClick(attendeeId) {
    if (loading || !jwt) {
      alert("errr")
      return
    }
    const respose = await fetch(BACKENDURL + "/checkins", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        attendee_id: attendeeId,
        activity_id: activityId,
        scanned_at: "2025-07-08T15:30:00Z", //todo change to time.now()
        status: "checked",
        scanned_by: ""
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
