import { signOut } from "firebase/auth";
import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { auth } from "../../../firebase/firebase";

export default function NavLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center w-screen">
      <div className="flex justify-between items-center w-full max-w-3xl px-4 py-4 border-b border-gray-300">
        <nav className="space-x-4">
          <Link
            to="/"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Events
          </Link>
          <Link
            to="/users"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Users
          </Link>
        </nav>
        <button
          className="bg-orange-700 text-white px-4 py-2 rounded hover:bg-orange-800"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <div className="w-full max-w-3xl px-4">
        <Outlet />
      </div>
    </div>
  );
}

