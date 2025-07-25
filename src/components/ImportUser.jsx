import React, { useState } from "react";
import useUserInfo from "../features/common/hooks/useUserInfo";
import { BACKENDURL } from "../configuration";

const ImportUsers = ({ eventId }) => {
  const [file, setFile] = useState(null);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { jwt } = useUserInfo();
  const [msg, setmsg] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setLogs([]);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    if (!jwt) {
      setError("JWT token not found. Please login.");
      return;
    }

    setLoading(true);
    setError("");
    setLogs([]);

    try {
      const response = await fetch(`${BACKENDURL}/importusers/${eventId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Something went wrong.");
      }

      const data = await response.json();
      setLogs(data);
      setmsg("Users imported successfully!");
      setTimeout(() => {
        setmsg("");
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg mt-10">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Import Users</h2>

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        className="mb-4 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl transition duration-200 disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload Excel File"}
      </button>

      {error && (
        <div className="mt-4 text-red-600 bg-red-100 p-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      {msg && (
        <div className="mt-4 text-green-700 bg-green-100 p-2 rounded-lg text-sm">
          {msg}
        </div>
      )}

      {logs.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Logs:</h3>
          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1 max-h-64 overflow-auto">
            {logs.map((log, index) => (
              <li key={index}>{log}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImportUsers;
