import React, { useEffect, useState } from "react";

import { BACKENDURL } from "../configuration";
import useUserInfo from "../features/common/hooks/useUserInfo";

export default function CheckIn() {
  const [checkIn, setCheckIn] = useState(null);
  const [status, setStatus] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { loading: userLoading, jwt } = useUserInfo();

  useEffect(() => {
    const fetchCheckIn = async () => {
      setLoading(true);

      if (userLoading || !jwt) return;
      const response = await fetch(`${BACKENDURL}/checkins`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setCheckIn(data);
        // setStatus(data.status);
        setMessage("");
      } else {
        setMessage("Error loading check-in.");
      }
      setLoading(false);
    };

    fetchCheckIn();
  }, []);

  const handleStatusUpdate = async (id) => {
    if (userLoading || !jwt) {
      alert("failed");
      return;
    }
    console.log(jwt);

    const response = await fetch(`${BACKENDURL}/checkins/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    console.log(response);

    if (response.ok) {
      const updatedCheckIn = await response.json();
      const filtredData = checkIn.filter((check) => check.id != id);
      console.log(filtredData);
      setCheckIn((pre) => {
        return [...filtredData, updatedCheckIn];
      });

      setStatus(updatedCheckIn.status);
      setEditMode(false);
      setMessage("Status updated successfully.");
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } else {
      setMessage("Error updating status.");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!checkIn) {
    return (
      <div className="text-center mt-10 text-red-500">
        No check-in data available.
      </div>
    );
  }

  return (
    <>
      {checkIn.map((check) => {
        return (
          <div
            className="max-w-xl mx-auto p-6 bg-white shadow rounded-xl mt-10"
            key={check.id}
          >
            <h2 className="text-2xl font-bold mb-4 text-center">
              Check-In Details
            </h2>

            <div className="bg-gray-100 p-4 rounded space-y-2">
              <p>
                <strong>Full Name:</strong> {check.full_name}
              </p>

              <p>
                <strong>Scanned At:</strong>{" "}
                {new Date(check.scanned_at).toLocaleString()}
              </p>
              <p>
                <strong>Scanned By:</strong>
                {check.scanned_by}
              </p>

              <p className="flex items-center">
                <strong>Status: {check.status}</strong>
                {editMode && (
                  <>
                    {check.status === "checked" ? (
                      <button
                        className="p-2 ml-2 bg-red-300 rounded-xl hover:scale-105 active:scale-95 cursor-pointer"
                        onClick={() => {
                          handleStatusUpdate(check.id);
                          setEditMode(false);
                        }}
                      >
                        Uncheck
                      </button>
                    ) : (
                      <button
                        className="p-2 ml-2 bg-green-300 hover:scale-105 active:scale-95 cursor-pointer rounded-xl"
                        onClick={() => {
                          handleStatusUpdate(check.id);
                          setEditMode(false);
                        }}
                      >
                        Check
                      </button>
                    )}
                  </>
                )}
              </p>
            </div>

            <div className="mt-4 text-center">
              {editMode ? (
                <>
                  <button
                    onClick={() => setEditMode(false)}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setEditMode(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Edit Status
                </button>
              )}
            </div>

            {message && (
              <p className="text-center text-green-600 mt-4">{message}</p>
            )}
          </div>
        );
      })}
    </>
  );
}
