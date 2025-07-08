
// EventsPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const containerStyle = {
  maxWidth: 600,
  margin: "20px auto",
  padding: 20,
  border: "1px solid #ccc",
  borderRadius: 6,
  backgroundColor: "#f9f9f9",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  marginTop: 10,
};

const inputStyle = {
  padding: 8,
  borderRadius: 4,
  border: "1px solid #ccc",
  fontSize: 16,
};

const buttonStyle = {
  padding: "8px 12px",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
};

const listItemStyle = {
  borderBottom: "1px solid #ddd",
  padding: "12px 0",
};

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: "", description: "", location: "", start_time: "", end_time: "" });

  useEffect(() => {
    fetch("http://localhost:4000/event")
      .then(res => res.json())
      .then(setEvents)
      .catch(console.error);
  }, []);

  async function createEvent(e) {
    e.preventDefault();
    try {

      const startISO = new Date(newEvent.start_time).toISOString();
      const endISO = new Date(newEvent.end_time).toISOString();
      await fetch("http://localhost:4000/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newEvent, start_time: startISO, end_time: endISO }),
      });
      setShowForm(false);
      setNewEvent({ name: "", description: "", location: "", start_time: "", end_time: "" });
      const res = await fetch("http://localhost:4000/event");
      const updatedEvents = await res.json();
      setEvents(updatedEvents);
    } catch (err) {
      alert("Failed to create event");
    }
  }

  return (
    <div style={containerStyle}>
      <h1>Events</h1>

      <button style={buttonStyle} onClick={() => setShowForm(true)}>Create Event</button>

      {showForm && (
        <form onSubmit={createEvent} style={formStyle}>
          <input placeholder="Name" value={newEvent.name} onChange={e => setNewEvent({ ...newEvent, name: e.target.value })} required style={inputStyle} />
          <input placeholder="Description" value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} style={inputStyle} />
          <input placeholder="Location" value={newEvent.location} onChange={e => setNewEvent({ ...newEvent, location: e.target.value })} style={inputStyle} />

          <input
            type="datetime-local"
            value={newEvent.start_time}
            onChange={e => setNewEvent({ ...newEvent, start_time: e.target.value })}
            required
            style={inputStyle}
          />
          <input
            type="datetime-local"
            value={newEvent.end_time}
            onChange={e => setNewEvent({ ...newEvent, end_time: e.target.value })}
            style={inputStyle}
          />
          <div>
            <button type="submit" style={{ ...buttonStyle, marginRight: 10 }}>Save</button>
            <button type="button" style={{ ...buttonStyle, backgroundColor: "#999" }} onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <ul style={{ marginTop: 20, paddingLeft: 0, listStyle: "none" }}>
        {events.map(e => (
          <li key={e.id} style={listItemStyle}>
            <div style={{ fontWeight: "bold" }}>{e.name} – {e.location}</div>
            <div style={{ marginTop: 5 }}>
              <Link to={`/activity/${e.id}`} style={{ textDecoration: "underline", color: "#2563eb" }}>
                View More
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventsPage;

