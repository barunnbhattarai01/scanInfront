import { useEffect, useState } from "react";
import { BACKENDURL } from "../configuration";

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
  padding: "10px 15px",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
};

const listItemStyle = {
  borderBottom: "1px solid #ddd",
  padding: "8px 0",
};

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({
    full_name: "",
    email: "",
    phone: "",
    role: "participant",
  });

  useEffect(() => {
    fetch(`${BACKENDURL}/user`)
      .then((res) => res.json())
      .then(setUsers)
      .catch(console.error);
  }, []);

  async function createUser(e) {
    e.preventDefault();
    try {
      await fetch(`${BACKENDURL}/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      setShowForm(false);
      setNewUser({ full_name: "", email: "", phone: "" });
      const res = await fetch(`${BACKENDURL}/user`);
      const updatedUsers = await res.json();
      setUsers(updatedUsers);
    } catch (err) {
      alert("Failed to create user");
    }
  }

  return (
    <div style={containerStyle}>
      <h1>Users</h1>
      <button style={buttonStyle} onClick={() => setShowForm(true)}>
        Add User
      </button>
      {showForm && (
        <form onSubmit={createUser} style={formStyle}>
          <input
            placeholder="Full Name"
            value={newUser.full_name}
            onChange={(e) =>
              setNewUser({ ...newUser, full_name: e.target.value })
            }
            required
            style={inputStyle}
          />
          <input
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
            style={inputStyle}
          />
          <input
            placeholder="Phone"
            value={newUser.phone}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            style={inputStyle}
          />
          <div>
            <button type="submit" style={{ ...buttonStyle, marginRight: 10 }}>
              Save
            </button>
            <button
              type="button"
              style={{ ...buttonStyle, backgroundColor: "#999" }}
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <ul style={{ marginTop: 20, paddingLeft: 0, listStyle: "none" }}>
        {users?.map((u) => (
          <li key={u.id} style={listItemStyle}>
            {u.full_name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersPage;
