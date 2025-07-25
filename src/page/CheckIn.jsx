import React, { useEffect, useState } from "react";
import { BACKENDURL } from "../configuration";
import useUserInfo from "../features/common/hooks/useUserInfo";

export default function CheckIn({ eventId }) {
  const [checkIn, setCheckIn] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { loading: userLoading, jwt } = useUserInfo();
  const [edit, setEdit] = useState({});

  // Toggle Edit Mode for a specific ID
  function toggleEdit(id) {
    setEdit((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  useEffect(() => {
    const fetchCheckIn = async () => {
      setLoading(true);
      if (userLoading || !jwt) return;

      try {
        const response = await fetch(`${BACKENDURL}/checkins/${eventId}`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });

        if (response.ok) {
          const data = await response.json();
          setCheckIn(data);
          setMessage("");
        } else {
          setMessage("Error loading check-in data.");
        }
      } catch (error) {
        setMessage("Network error.");
      }
      setLoading(false);
    };

    fetchCheckIn();
  }, [userLoading, jwt]);

  const handleStatusUpdate = async (id, currentStatus) => {
    if (userLoading || !jwt) {
      alert("Authentication failed.");
      return;
    }

    const newStatus = currentStatus === "checked" ? "unchecked" : "checked";

    try {
      const response = await fetch(`${BACKENDURL}/checkins/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedCheckIn = await response.json();

        setCheckIn((prev) =>
          prev.map((check) =>
            check.id === id
              ? { ...check, status: updatedCheckIn.status }
              : check
          )
        );

        setEdit((prev) => ({ ...prev, [id]: false }));
        setMessage("Status updated.");
        setTimeout(() => {
          setMessage("");
        }, 2000);
      } else {
        setMessage("Failed to update status.");
      }
    } catch (error) {
      setMessage("Network error while updating.");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!checkIn || checkIn.length === 0) {
    return (
      <div className="text-center mt-10 text-red-500">
        {message || "No check-in data available."}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <h2 className="text-2xl font-bold text-center">Check-In Details</h2>
      {message && (
        <div className="text-center text-green-500 font-semibold mt-2">
          {message}
        </div>
      )}
      {checkIn.map((check) => (
        <div
          key={check.id}
          className="max-w-xl mx-auto p-6 bg-white shadow rounded-xl mt-10"
        >
          {console.log(check)}
          <div className="bg-gray-100 p-4 rounded space-y-2">
            <p>
              <strong>Full Name:</strong> {check.full_name}
            </p>
            <p>
              <strong>Scanned At:</strong>{" "}
              {new Date(check.scanned_at).toLocaleString()}
            </p>
            <p>
              <strong>Scanned By:</strong> {check.scanned_by}
            </p>
            <p className="flex items-center gap-2">
              <strong>Status:</strong> {check.status}
              {edit[check.id] && (
                <button
                  onClick={() => handleStatusUpdate(check.id, check.status)}
                  className={`p-2 rounded-xl text-white ${
                    check.status === "checked"
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {check.status === "checked" ? "Uncheck" : "Check"}
                </button>
              )}
            </p>
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={() => toggleEdit(check.id)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {edit[check.id] ? "Cancel" : "Edit Status"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
