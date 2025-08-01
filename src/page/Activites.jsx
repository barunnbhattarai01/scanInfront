import { useState, useEffect } from "react";
import { BACKENDURL } from "../configuration";
import { useNavigate } from "react-router-dom";

export default function Activities({ eventId, loading, jwt }) {
  const [showAddActivityForm, setShowAddActivityForm] = useState(false);
  const [activities, setActivities] = useState(null);
  const [totalParticipants, setTotalParticipants] = useState(0);
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

  const fetchEventInfo = async () => {
    try {
      const res = await fetch(`${BACKENDURL}/eventinfo?event_id=${eventId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const data = await res.json();
      setActivities(data.activities);
      setTotalParticipants(data.event.number_of_participant);
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

  if (!activities) {
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

      {activities.length != 0 ? (
        <ul className="list-none p-0">
          {activities?.map((a) => (
            <li
              key={a.id}
              className="mb-3 p-3 border border-gray-300 rounded cursor-pointer flex justify-between items-center"
              onClick={() => {
                navigate(`/scan/${a.id}`);
              }}
            ><div>
                <strong>{a.name}</strong> – {a.type}
                <br />
                Start: {new Date(a.start_time).toLocaleString()}
                <br />
                End: {new Date(a.end_time).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
               { console.log(activities.number_of_participant) }
                 
                {a.number_of_scaned_users}/{totalParticipants} 
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p> No activites found</p>
      )}
    </>
  );
}
