import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { auth } from "../../../firebase/firebase";
import { getAuth, signOut } from "firebase/auth";

export default function NavLayout() {
  const [style, setStyle] = useState("scan");
  const navigate = useNavigate();

  // function styleChange(name) {
  //   setStyle(name);
  // }

  // function to sign out

  async function logOut() {
    await signOut(auth);
    navigate("/login", { replace: true });
  }

  return (
    <>
      <div className="flex flex-row   w-full md:px-80 px-5  items-center">
        <nav
          className={`p-3  max-w-[600px] mx-auto my-5 flex flex-wrap gap-4 justify-center`}
        >
          <Link
            onClick={() => {
              setStyle("scan");
            }}
            to="/"
            className={`text-blue-600 rounded-xs hover:text-blue-800 transition-colors border-1 border-blue-200 px-3 py-1 ${
              style == "scan" ? "bg-blue-500 text-blue-950 font-semibold" : ""
            }`}
          >
            Scan
          </Link>
          <Link
            onClick={() => {
              setStyle("event");
            }}
            to="/event"
            className={`text-blue-600 rounded-xs hover:text-blue-800 transition-colors border-1 border-blue-200 px-3 py-1 ${
              style == "event" ? "bg-blue-500 text-blue-950 font-semibold" : ""
            }`}
          >
            Events
          </Link>
          <Link
            onClick={() => {
              setStyle("user");
            }}
            to="/users"
            className={`text-blue-600 rounded-xs hover:text-blue-800 transition-colors border-1 border-blue-200 px-3 py-1 ${
              style == "user" ? "bg-blue-500 text-blue-950 font-semibold" : ""
            }`}
          >
            Users
          </Link>
        </nav>
        <button
          className="bg-orange-300 px-2 rounded-xs font-semibold py-1 cursor-pointer hover:bg-orange-400 active:scale-95 hover:scale-105"
          onClick={logOut}
        >
          Log out
        </button>
      </div>
      <Outlet />
    </>

  );
}

