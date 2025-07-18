import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import PdfFile from "../features/common/component/PdfFile";
import { BACKENDURL } from "../configuration";
import CheckIn from "./CheckIn";
import useUserInfo from "../features/common/hooks/useUserInfo";

const style = {
  container: {
    maxWidth: 600,
    margin: "20px auto",
    padding: 20,
    fontFamily: "Arial, sans-serif",
  },
  toggleContainer: {
    display: "flex",
    gap: 10,
    marginBottom: 20,
  },
  toggleButton: (active) => ({
    padding: "8px 16px",
    cursor: "pointer",
    borderRadius: 4,
    border: "1px solid #2563eb",
    backgroundColor: active ? "#2563eb" : "white",
    color: active ? "white" : "#2563eb",
    fontWeight: active ? "bold" : "normal",
  }),
  button: {
    padding: "8px 12px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    marginBottom: 20,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 20,
    padding: 10,
    border: "1px solid #ccc",
    borderRadius: 4,
  },
  input: {
    padding: 8,
    borderRadius: 4,
    border: "1px solid #ccc",
    fontSize: 16,
  },
  listItem: {
    marginBottom: 10,
    padding: 10,
    border: "1px solid #ddd",
    borderRadius: 4,
  },
};

function ActivitiesPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [activities, setActivities] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [view, setView] = useState("activities");

  const { loading, jwt, user } = useUserInfo();

  // Form state toggles
  const [showAddActivityForm, setShowAddActivityForm] = useState(false);
  const [showAddAttendeeForm, setShowAddAttendeeForm] = useState(false);
  const [showScanIn, setShowScanIn] = useState(false);
  // Form data

  const [activityForm, setActivityForm] = useState({
    name: "",
    type: "",
    start_time: "",
    end_time: "",
  });
  const [attendeeForm, setAttendeeForm] = useState({
    user_id: "",
    role: "participant",
  });

  const [users, setUsers] = useState([]);

  const fetchEventInfo = async () => {
    try {
      const res = await fetch(`${BACKENDURL}/eventinfo?event_id=${eventId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const data = await res.json();
      setEvent(data.event);
      setActivities(data.activities);
    } catch (err) {
      console.error("Failed to fetch event info", err);
    }
  };

  const fetchAttendees = async () => {
    try {
      const res = await fetch(`${BACKENDURL}/users/${eventId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data != null) {
          console.log(data);
          setAttendees(data);
        }
      } else {
        setAttendees([]);
      }
    } catch (err) {
      console.error("Failed to fetch attendees", err);
      setAttendees([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${BACKENDURL}/user`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const data = await res.json();
      if (data != null) {
        setUsers(data);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    if (loading) return;
    fetchEventInfo();
    fetchUsers();
    fetchAttendees();
  }, [eventId, loading]);

  //// When view changes to attendees, fetch attendees fresh
  //useEffect(() => {
  //  if (loading) return
  //  if (view === "attendees") {
  //    fetchAttendees();
  //  }
  //}, [view, eventId, loading]);

  const handleActivityChange = (e) => {
    setActivityForm({ ...activityForm, [e.target.name]: e.target.value });
  };

  const handleAttendeeChange = (e) => {
    setAttendeeForm({ ...attendeeForm, [e.target.name]: e.target.value });
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    try {
      const startISO = new Date(activityForm.start_time).toISOString();
      const endISO = new Date(activityForm.end_time).toISOString();
      const res = await fetch(`${BACKENDURL}/activity`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...activityForm,
          start_time: startISO,
          end_time: endISO,
          event_id: eventId,
        }),
      });
      if (!res.ok) throw new Error("Failed to add activity");

      setActivityForm({ name: "", type: "", start_time: "", end_time: "" });
      setShowAddActivityForm(false);
      fetchEventInfo();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddAttendee = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BACKENDURL}/attendees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ ...attendeeForm, event_id: eventId }),
      });
      if (!res.ok) throw new Error("Failed to add attendee");

      setAttendeeForm({ user_id: "", role: "participant" });
      setShowAddAttendeeForm(false);
      fetchAttendees();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-5 font-sans">
      {event && (
        <>
          <h1 className="text-2xl font-bold">{event.name}</h1>
          <p className="text-gray-600">{event.description}</p>
        </>
      )}

      {/* Toggle Activities / Attendees/ checkin */}
      <div className="flex gap-2 mb-5">
        <button
          className={`px-4 py-2 border border-blue-600 rounded ${
            view === "activities"
              ? "bg-blue-600 text-white font-bold"
              : "bg-white text-blue-600"
          }`}
          onClick={() => setView("activities")}
        >
          Activities
        </button>
        <button
          className={`px-4 py-2 border border-blue-600 rounded ${
            view === "attendees"
              ? "bg-blue-600 text-white font-bold"
              : "bg-white text-blue-600"
          }`}
          onClick={() => setView("attendees")}
        >
          Attendees
        </button>
        <button
          className={`px-4 py-2 border border-blue-600 rounded ${
            view === "checkin"
              ? "bg-blue-600 text-white font-bold"
              : "bg-white text-blue-600"
          }`}
          onClick={() => {
            setView("checkin");
            // setShowAddActivityForm(false);
            // setShowAddAttendeeForm(false);
          }}
        >
          Check In
        </button>
      </div>

      {view === "activities" && (
        <>
          <button
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => setShowAddActivityForm((v) => !v)}
          >
            {showAddActivityForm ? "Cancel Add Activity" : "Add Activity"}
          </button>

          {showAddActivityForm && (
            <form
              onSubmit={handleAddActivity}
              className="flex flex-col gap-3 p-4 border border-gray-300 rounded mb-5"
            >
              <input
                name="name"
                placeholder="Activity Name"
                value={activityForm.name}
                onChange={handleActivityChange}
                required
                className="p-2 border border-gray-300 rounded text-base"
              />
              <input
                name="type"
                placeholder="Type"
                value={activityForm.type}
                onChange={handleActivityChange}
                required
                className="p-2 border border-gray-300 rounded text-base"
              />
              <input
                name="start_time"
                type="datetime-local"
                value={activityForm.start_time}
                onChange={handleActivityChange}
                required
                className="p-2 border border-gray-300 rounded text-base"
              />
              <input
                name="end_time"
                type="datetime-local"
                value={activityForm.end_time}
                onChange={handleActivityChange}
                required
                className="p-2 border border-gray-300 rounded text-base"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Submit Activity
              </button>
            </form>
          )}

          <h2 className="text-xl font-semibold mb-2">Activities</h2>
          <ul className="list-none p-0">
            {activities?.map((a) => (
              <li
                key={a.id}
                style={style.listItem}
                onClick={() => {
                  console.log(a);
                  navigate(`/scan/${a.id}`);
                }}
              >
                <strong>{a.name}</strong> – {a.type}
                <br />
                Start: {new Date(a.start_time).toLocaleString()}
                <br />
                End: {new Date(a.end_time).toLocaleString()}
              </li>
            ))}
          </ul>
        </>
      )}

      {view === "attendees" && (
        <>
          <button
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => setShowAddAttendeeForm((v) => !v)}
          >
            {showAddAttendeeForm ? "Cancel Add Attendee" : "Add Attendee"}
          </button>

          {showAddAttendeeForm && (
            <form
              onSubmit={handleAddAttendee}
              className="flex flex-col gap-3 p-4 border border-gray-300 rounded mb-5"
            >
              <select
                name="user_id"
                value={attendeeForm.user_id}
                onChange={handleAttendeeChange}
                required
                className="p-2 border border-gray-300 rounded text-base"
              >
                <option value="">-- Select User --</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.full_name} -- {u.company}
                  </option>
                ))}
              </select>

              <select
                name="role"
                value={attendeeForm.role}
                onChange={handleAttendeeChange}
                required
                className="p-2 border border-gray-300 rounded text-base"
              >
                <option value="participant">Participant</option>
                <option value="staff">Staff</option>
                <option value="member">Member</option>
              </select>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Submit Attendee
              </button>
            </form>
          )}

          <h2 className="text-xl font-semibold mb-2">Attendees</h2>
          <ul className="list-none p-0">
            {attendees.length > 0 ? (
              <PdfFile
                attendees={attendees.map((att) => ({
                  eventId,
                  attendee_id: att.attendee_id,
                  username: att.full_name,
                  role: att.role,
                  phone: att.phone,
                  image_url: att.image_url,
                  auto_id:att.auto_id
                }))}
              />
            ) : (
              <li>No attendees found.</li>
            )}
          </ul>
        </>
      )}

      {view === "checkin" && <CheckIn />}

      <Link to="/" style={{ textDecoration: "underline", color: "#2563eb" }}>
        ← Back to Events
      </Link>
    </div>
  );
}

export default ActivitiesPage;
