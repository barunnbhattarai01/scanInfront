import { useState, useEffect } from "react";
import QRScanner from "../components/QrScanner";
import { useNavigate, useParams } from "react-router-dom";
import { BACKENDURL } from "../../../configuration";
import useUserInfo from "../../common/hooks/useUserInfo";
import { CheckCircle, XCircle } from "lucide-react";
import "./animation.css";

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
      }, 3000);
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
      <QRScanner onScanSuccess={(text) => onClick(text)} />

      {message &&
        (message.type == "success" ? (
          <div>
            <div class="success-checkmark">
              <div class="check-icon">
                <span class="icon-line line-tip"></span>
                <span class="icon-line line-long"></span>
                <div class="icon-circle"></div>
                <div class="icon-fix"></div>
              </div>
            </div>
            <center>
              <button id="restart">Restart Animation</button>
            </center>
          </div>
        ) : (
          <div>
            <svg
              class="crossmark addClass"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
            >
              <circle
                class="crossmark__circle addClass"
                cx="26"
                cy="26"
                r="25"
                fill="none"
              />
              <path
                class="cross__path cross__path--right addClass"
                fill="none"
                d="M16,16 l20,20"
              />
              <path
                class="cross__path cross__path--left addClass"
                fill="none"
                d="M16,36 l20,-20"
              />
            </svg>
          </div>
        ))}
    </div>
  );
}

export default ScanQr;
