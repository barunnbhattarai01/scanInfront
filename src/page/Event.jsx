import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useUserInfo from "../features/common/hooks/useUserInfo";
import { BACKENDURL } from "../configuration";

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    location: "",
    start_time: "",
    end_time: "",
  });

  const { user, jwt, loading } = useUserInfo();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user || !jwt) {
      navigate("/login", { replace: true });
      return;
    }
    console.log(jwt);

    fetch(`${BACKENDURL}/event`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        if (json != null) {
          setEvents(json);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [loading, jwt]);

  // to check if the user session in valid

  async function createEvent(e) {
    e.preventDefault();
    try {
      const startISO = new Date(newEvent.start_time).toISOString();
      const endISO = new Date(newEvent.end_time).toISOString();
      await fetch(`${BACKENDURL}/event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          ...newEvent,
          start_time: startISO,
          end_time: endISO,
        }),
      });
      setShowForm(false);
      setNewEvent({
        name: "",
        description: "",
        location: "",
        start_time: "",
        end_time: "",
      });
      const res = await fetch(`${BACKENDURL}/event`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const updatedEvents = await res.json();
      setEvents(updatedEvents);
    } catch (err) {
      alert("Failed to create event");
    }
  }

  return (
    <div className="w-max-130 md:w-180 mx-auto mt-5 p-5 border border-gray-300 rounded-md bg-gray-100">
      <button
        className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        onClick={() => setShowForm(true)}
      >
        Create Event
      </button>

      {showForm && (
        <form onSubmit={createEvent} className="flex flex-col gap-3 mt-3">
          <input
            placeholder="Name"
            value={newEvent.name}
            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
            required
            className="p-2 rounded-md border border-gray-300 text-lg"
          />
          <input
            placeholder="Description"
            value={newEvent.description}
            onChange={(e) =>
              setNewEvent({ ...newEvent, description: e.target.value })
            }
            className="p-2 rounded-md border border-gray-300 text-lg"
          />
          <input
            placeholder="Location"
            value={newEvent.location}
            onChange={(e) =>
              setNewEvent({ ...newEvent, location: e.target.value })
            }
            className="p-2 rounded-md border border-gray-300 text-lg"
          />
          <input
            type="datetime-local"
            value={newEvent.start_time}
            onChange={(e) =>
              setNewEvent({ ...newEvent, start_time: e.target.value })
            }
            required
            className="p-2 rounded-md border border-gray-300 text-lg"
          />
          <input
            type="datetime-local"
            value={newEvent.end_time}
            onChange={(e) =>
              setNewEvent({ ...newEvent, end_time: e.target.value })
            }
            className="p-2 rounded-md border border-gray-300 text-lg"
          />
          <input
            type="text"
            value={newEvent.organizer}
            placeholder="Name of the Organizer"
            onChange={(e) =>
              setNewEvent({ ...newEvent, organizer: e.target.value })
            }
            className="p-2 rounded-md border border-gray-300 text-lg"
          />
          <div>
            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-2"
            >
              Save
            </button>
            <button
              type="button"
              className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-5 pl-0 w-full">
        {events?.map((e) => (
          <div
            key={e.id}
            className="border-b border-gray-300 py-3 flex flex-row justify-between items-center"
          >
            <div className="font-semibold flex flex-row items-center gap-3 md:gap-15 w-80 md:w-140">
              <img src="img/event.jpg" alt="" className="w-25 md:w-30 " />

              <div className="flex flex-col">
                {e.name} – {e.location}
                <div>
                  <p>
                    {new Date(e.start_time).toLocaleString()} to{" "}
                    {new Date(e.end_time).toLocaleString()}
                  </p>
                  <p>{e.description}</p>
                </div>
              </div>
            </div>

            <div className="mt-1 items-center flex flex-col gap-3 justify-center w-30">
              <Link
                to={`/activity/${e.id}`}
                className="underline text-blue-600 hover:text-blue-800"
              >
                View More
              </Link>

              <p className="px-2 py-1 hover:bg-orange-400 hover:scale-105 active:scale-95 cursor-pointer  bg-orange-200 rounded-xs">
                Modify
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventsPage;
