import { useState, useEffect } from "react";
import QRScanner from "../components/QrScanner";
import { useNavigate, useParams } from "react-router-dom";
import { BACKENDURL } from "../../../configuration";
import useUserInfo from "../../common/hooks/useUserInfo";
import { CheckCircle, XCircle } from "lucide-react";

function ScanQr() {
  const { user, loading, jwt } = useUserInfo();
  const { activityId } = useParams();
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  //disappering logic of sucessfully checkin and failed checkin
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

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
      setMessage({
        type: "error",
        text: (
          <span className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            Authentication error!
          </span>
        ),
      });
      return;
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
        scanned_at: new Date().toISOString(), //todo change to time.now()
        status: "checked",
        scanned_by: user.id,
      }),
    });
    if (respose.ok) {
      setMessage({
        type: "success",
        text: (
          <span className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 " />
            Successfully Checked-in!
          </span>
        ),
      });
      return;
    } else {
      setMessage({
        type: "error",
        text: (
          <span className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            Check-in Failed!
          </span>
        ),
      });
      return;
    }
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

      {message && (
        <div
          className={`mt-5 px-6 py-3 rounded-lg text-sm font-medium border ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border-green-300"
              : "bg-red-100 text-red-800 border-red-300"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}

export default ScanQr;
