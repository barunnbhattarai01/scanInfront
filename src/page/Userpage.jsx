import { useEffect, useState } from "react";
import { BACKENDURL } from "../configuration";
import useUserInfo from "../features/common/hooks/useUserInfo";

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
  const { loading, jwt } = useUserInfo();

  const [newUser, setNewUser] = useState({
    image_url: "",
  });
  const [img, setimg] = useState("");

  useEffect(() => {
    if (loading || !jwt) return;
    fetch(`${BACKENDURL}/user`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((res) => res.json())
      .then(setUsers)
      .catch(console.error);
  }, [loading]);

  async function createUser(e) {
    e.preventDefault();
    if (loading || !jwt) {
      alert("failed");
      return;
    }

    try {
      console.log(newUser);
      await fetch(`${BACKENDURL}/user`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      setShowForm(false);
      setNewUser({ image_url: "nothing for now" });
      const res = await fetch(`${BACKENDURL}/user`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const updatedUsers = await res.json();
      setUsers(updatedUsers);
    } catch (err) {
      setUsers([]);
      alert("Failed to create user");
    }
  }
  //uploading images

  const handleimage = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    //  console.log(file);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "projectscanin");
    data.append("cloud_name", "dgedgcxss");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dgedgcxss/image/upload",
      {
        method: "POST",
        body: data,
      }
    );
    const imagesurl = await res.json();
    setNewUser((pre) => {
      return {
        ...pre,
        image_url: imagesurl.url,
      };
    });
    console.log(imagesurl.url);
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-8 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Users</h1>

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
        onClick={() => setShowForm(true)}
      >
        Add User
      </button>

      {showForm && (
        <form onSubmit={createUser} className="flex flex-col gap-4 mt-6">
          <input
            placeholder="Full Name"
            value={newUser.full_name}
            onChange={(e) =>
              setNewUser({ ...newUser, full_name: e.target.value })
            }
            required
            className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            placeholder="Company"
            value={newUser.company}
            onChange={(e) =>
              setNewUser({ ...newUser, company: e.target.value })
            }
            required
            className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            placeholder="Position"
            value={newUser.position}
            onChange={(e) =>
              setNewUser({ ...newUser, position: e.target.value })
            }
            style={inputStyle}
          />

          {/* file upload */}

          <div>
            <label className="block text-sm font-medium text-black  mb-1">
              Upload Image
            </label>
            <input
              type="file"
              onChange={handleimage}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-xl p-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
            >
              Save
            </button>
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <ul className="mt-6 list-none pl-0">
        {users?.map((u) => (
          <li
            key={u.id}
            style={listItemStyle}
            className="flex w-full justify-between"
          >
            <div>{u.full_name}</div>
            <div>{u.auto_id}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersPage;
