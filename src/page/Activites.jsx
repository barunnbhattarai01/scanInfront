import { useState, useEffect } from "react";
import { BACKENDURL } from "../configuration";
import { useNavigate } from "react-router-dom";

export default function Activities({ eventId, loading, jwt }) {
  const [showAddActivityForm, setShowAddActivityForm] = useState(false);
  const [activities, setActivities] = useState([]);
  const [event, setEvent] = useState(null);
  const navigate = useNavigate();

  const [activityForm, setActivityForm] = useState({
    name: "",
    type: "",
    start_time: "",
    end_time: "",
  });
  const handleActivityChange = (e) => {
    setActivityForm({ ...activityForm, [e.target.name]: e.target.value });
  };

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

  useEffect(() => {
    if (loading) return;
    fetchEventInfo();
    // fetchUsers();
    // fetchAttendees();
  }, [eventId, loading]);

  if (activities.length == 0) {
    return <div>Loading please wait...</div>;
  }

  return (
    <>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => setShowAddActivityForm((v) => !v)}
      >
        {showAddActivityForm ? "Cancel Add Activity" : "Add Activity"}
      </button>

      {showAddActivityForm && (
        <>
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
        </>
      )}

      <h2 className="text-xl font-semibold mb-2">Activities</h2>
      <ul className="list-none p-0">
        {activities?.map((a) => (
          <li
            key={a.id}
            className="mb-3 p-3 border border-gray-300 rounded cursor-pointer"
            onClick={() => {
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
  );
}
