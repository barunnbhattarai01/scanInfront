import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PdfFile from "../features/common/component/PdfFile";
import { BACKENDURL } from "../configuration";
import { Ban } from "lucide-react";
import CheckIn from "./CheckIn";

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

  const [event, setEvent] = useState(null);
  const [activities, setActivities] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [view, setView] = useState("activities");

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

  // Fetch event info and activities
  const fetchEventInfo = async () => {
    try {
      const res = await fetch(`${BACKENDURL}/eventinfo?event_id=${eventId}`);
      const data = await res.json();
      setEvent(data.event);
      setActivities(data.activities);
    } catch (err) {
      console.error("Failed to fetch event info", err);
    }
  };

  // Fetch attendees for event
  const fetchAttendees = async () => {
    try {
      const res = await fetch(`${BACKENDURL}/users/${eventId}`);
      if (res.ok) {
        const data = await res.json();
        if (data != null) {
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

  // Fetch users for attendee form select
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${BACKENDURL}/user`);
      const data = await res.json();
      if (data != null) {
        setUsers(data);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  // Initial fetch & fetch users
  useEffect(() => {
    fetchEventInfo();
    fetchUsers();
  }, [eventId]);

  // When view changes to attendees, fetch attendees fresh
  useEffect(() => {
    if (view === "attendees") {
      fetchAttendees();
    }
  }, [view, eventId]);

  // Handlers for form inputs
  const handleActivityChange = (e) => {
    setActivityForm({ ...activityForm, [e.target.name]: e.target.value });
  };

  const handleAttendeeChange = (e) => {
    setAttendeeForm({ ...attendeeForm, [e.target.name]: e.target.value });
  };

  // Submit new activity
  const handleAddActivity = async (e) => {
    e.preventDefault();
    try {
      const startISO = new Date(activityForm.start_time).toISOString();
      const endISO = new Date(activityForm.end_time).toISOString();
      const res = await fetch(`${BACKENDURL}/activity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        headers: { "Content-Type": "application/json" },
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
    <div style={style.container}>
      {event && (
        <>
          <h1>{event.name}</h1>
          <p>{event.description}</p>
        </>
      )}

      {/* Toggle Activities / Attendees */}
      <div style={style.toggleContainer}>
        <button
          style={style.toggleButton(view === "activities")}
          onClick={() => {
            setView("activities");
            // setShowAddActivityForm(false);
            // setShowAddAttendeeForm(false);
          }}
        >
          Activities
        </button>
        <button
          style={style.toggleButton(view === "attendees")}
          onClick={() => {
            setView("attendees");
            // setShowAddActivityForm(false);
            // setShowAddAttendeeForm(false);
          }}
        >
          Attendees
        </button>

        <button
          style={style.toggleButton(view === "checkin")}
          onClick={() => {
            setView("checkin");
            setShowAddActivityForm(false);
            setShowAddAttendeeForm(false);
          }}
        >
          Check In
        </button>
      </div>

      {/* Show Add button and form conditionally */}
      {view === "activities" && (
        <>
          <button
            style={style.button}
            onClick={() => setShowAddActivityForm((v) => !v)}
          >
            {showAddActivityForm ? "Cancel Add Activity" : "Add Activity"}
          </button>

          {showAddActivityForm && (
            <form onSubmit={handleAddActivity} style={style.form}>
              <input
                name="name"
                placeholder="Activity Name"
                value={activityForm.name}
                onChange={handleActivityChange}
                required
                style={style.input}
              />
              <input
                name="type"
                placeholder="Type"
                value={activityForm.type}
                onChange={handleActivityChange}
                required
                style={style.input}
              />
              <input
                name="start_time"
                type="datetime-local"
                value={activityForm.start_time}
                onChange={handleActivityChange}
                required
                style={style.input}
              />
              <input
                name="end_time"
                type="datetime-local"
                value={activityForm.end_time}
                onChange={handleActivityChange}
                required
                style={style.input}
              />
              <button type="submit" style={style.button}>
                Submit Activity
              </button>
            </form>
          )}

          <h2>Activities</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {activities?.map((a) => (
              <li key={a.id} style={style.listItem}>
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
            style={style.button}
            onClick={() => setShowAddAttendeeForm((v) => !v)}
          >
            {showAddAttendeeForm ? "Cancel Add Attendee" : "Add Attendee"}
          </button>

          {showAddAttendeeForm && (
            <form onSubmit={handleAddAttendee} style={style.form}>
              <select
                name="user_id"
                value={attendeeForm.user_id}
                onChange={handleAttendeeChange}
                required
                style={style.input}
              >
                <option value="">-- Select User --</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.full_name} ({u.email})
                  </option>
                ))}
              </select>

              <select
                name="role"
                value={attendeeForm.role}
                onChange={handleAttendeeChange}
                required
                style={style.input}
              >
                <option value="participant">Participant</option>
                <option value="staff">Staff</option>
                <option value="member">Member</option>
              </select>

              <button type="submit" style={style.button}>
                Submit Attendee
              </button>
            </form>
          )}

          <h2>Attendees</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {attendees.length > 0 ? (
              attendees.map((att) => (
                <PdfFile
                  eventId={eventId}
                  attendee_id={att.attendee_id}
                  key={att.id}
                  email={att.email || att.user_email || "N/A"}
                  username={att.full_name}
                  role={att.role}
                  phone={att.phone}
                />
              ))
            ) : (
              <li>No attendees found.</li>
            )}
          </ul>
        </>
      )}

      {view === "checkin" && <CheckIn />}

      <Link
        to="/event"
        style={{ textDecoration: "underline", color: "#2563eb" }}
      >
        ← Back to Events
      </Link>
    </div>
  );
}

export default ActivitiesPage;

// (
//               attendees.map((att) => (
//                 <li key={att.id} style={style.listItem}>
//                   <strong>{att.full_name}</strong> — Role: {att.role}
//                   <br />
//                   Email: {att.email || att.user_email || "N/A"}
//                   <br />
//                   Phone: {att.phone || "N/A"}
//                   <br />
//                   <div style={{ marginTop: 10 }}>
//                     <QRCodeGenerator
//                       text={JSON.stringify({
//                         eventId: eventId,
//                         userId: att.id,
//                       })}
//                       size={100}
//                     />
//                   </div>
//                 </li>
//               ))
//             )
