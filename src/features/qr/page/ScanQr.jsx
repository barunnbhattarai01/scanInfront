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
        text: "Qr successfully scanned",
      });
      return;
    } else if (respose.status === 409) {
      setMessage({
        type: "twice",
        text: "Same qr cannot be scanned twice",
      });
    } else {
      setMessage({
        type: "invalid",
        text: "The qr is invalid",
      });
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
      {!message && <QRScanner onScanSuccess={(text) => onClick(text)} />}

      {message &&
        (message?.type == "success" ? (
          <div>
            <div className="min-h-80 flex flex-col justify-center items-center">
              <div class="success-checkmark">
                <div class="check-icon">
                  <span class="icon-line line-tip"></span>
                  <span class="icon-line line-long"></span>
                  <div class="icon-circle"></div>
                  <div class="icon-fix"></div>
                </div>
              </div>
              <p className="font-black text-green-400 text-xl capitalize">
                Qr scanning was successfull
              </p>
            </div>
          </div>
        ) : message?.type == "twice" ? (
          <div className="min-h-80 flex justify-center items-center flex-col">
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

            <p className="font-black text-red-400 text-xl capitalize">
              Same qr cannot be scanned twice
            </p>
          </div>
        ) : (
          <div className="min-h-80 flex justify-center items-center flex-col">
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

            <p className="font-black text-red-400 text-xl capitalize">
              The Provided qr is invalid
            </p>
          </div>
        ))}
    </div>
  );
}

export default ScanQr;
