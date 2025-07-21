import { checkActionCode } from "firebase/auth";
import { useEffect, useState } from "react";
import QRCodeGenerator from "../features/qr/components/QRCodeGenerator";

export default function UserList({ attendees }) {
  const [makeLoading, setMakeLoading] = useState(false);
  const [showqr, setShowqr] = useState(false);
  const [aid, setAid] = useState(null);
  const [mid, setMid] = useState(null);

  // function to handle the lagging of the ui

  function checkData() {
    if (attendees.length > 100) {
      setMakeLoading(true);
      setTimeout(() => {
        setMakeLoading(false);
      }, 3000);
    }
  }

  useEffect(() => {
    checkData();
  }, []);

  if (makeLoading) {
    return <p>Loding data please wait...</p>;
  }

  return (
    <>
      <div className="flex justify-center w-180 md:w-full">
        <table className="border-collapse border border-gray-400 p-2 mt-5 w-100">
          <thead>
            <tr>
              <td className="border border-gray-300 p-3">ID</td>

              <td className="border border-gray-300 p-3">Full Name</td>

              <td className="border border-gray-300 p-3">Position</td>
              <td className="border border-gray-300 p-3">Company</td>
              <td className="border border-gray-300 p-3">Qr code</td>
              <td className="border border-gray-300 p-3">Status</td>
            </tr>
          </thead>
          <tbody>
            {attendees.map((u) => {
              return (
                <tr key={u.id}>
                  <td className="border border-gray-300 p-3">
                    {u.role}-{u.auto_id}
                  </td>
                  <td className="border border-gray-300 p-3">{u.full_name}</td>

                  <td className="border border-gray-300 p-3">{u.position}</td>
                  <td className="border border-gray-300 p-3">{u.company}</td>
                  <td className="border border-gray-300 p-3">
                    <button
                      className="p-2 bg-orange-100 rounded-xl hover:scale-105 active:scale-95 cursor-pointer "
                      onClick={() => {
                        setShowqr(true);
                        setAid(u.attendee_id);
                        const id = `${u.role}-${u.auto_id}`;
                        setMid(id);
                      }}
                    >
                      View
                    </button>
                  </td>
                  <td className="border border-gray-300 p-3">Status for now</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {showqr && (
          <div className="w-60 fixed bg-orange-200 shadow-2xl flex flex-col justify-center items-center top-20 rounded-2xl">
            <QRCodeGenerator text={aid} />
            {mid}
            <button
              className="px-2 py-1 bg-orange-400 cursor-pointer hover:scale-105 active:scale-95 mt-2 rounded-xs mb-2"
              onClick={() => {
                setShowqr(false);
              }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </>
  );
}
