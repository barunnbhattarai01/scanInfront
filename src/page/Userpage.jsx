import { useEffect, useState } from "react";
import { BACKENDURL } from "../configuration";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({
    full_name: "",
    email: "",
    phone: "",
    role: "participant",
  });
  const [img, setimg] = useState("");

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
      alert("Failed to create user", err);
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
    setimg(imagesurl.url);
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
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
            className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            placeholder="Phone"
            value={newUser.phone}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            className="border-b border-gray-300 py-3 text-gray-800 hover:text-blue-600"
          >
            {u.full_name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersPage;
