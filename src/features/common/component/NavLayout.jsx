import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function NavLayout() {
  return (
    <>
      <nav
        style={{
          padding: 10,
          borderBottom: "1px solid #ccc",
          maxWidth: 600,
          margin: "20px auto",
        }}
      >
        <Link
          to="/"
          style={{
            marginRight: 10,
            color: "#2563eb",
            textDecoration: "underline",
          }}
        >
          Events
        </Link>
        <Link
          to="/users"
          style={{ color: "#2563eb", textDecoration: "underline" }}
        >
          Users
        </Link>
        <Outlet />
      </nav>
    </>
  );
}
