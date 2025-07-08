import React, { useState } from "react";
import { User, Mail, Phone } from "lucide-react";

export default function EmployeeForm({ open }) {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    contact: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Submitted:", employee);
    // API / validation
  };

  return (
    <div className=" bg-gray-100 flex items-center justify-center absolute right-0">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 space-y-6 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Employee Information
        </h2>

        <div className="space-y-5">
          {/* Name */}
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
            <User className="text-gray-500 mr-3" size={18} />
            <input
              type="text"
              name="name"
              value={employee.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full focus:outline-none text-sm text-gray-800 bg-transparent"
              required
            />
          </div>

          {/* Email */}
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
            <Mail className="text-gray-500 mr-3" size={18} />
            <input
              type="email"
              name="email"
              value={employee.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full focus:outline-none text-sm text-gray-800 bg-transparent"
              required
            />
          </div>

          {/* Contact */}
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
            <Phone className="text-gray-500 mr-3" size={18} />
            <input
              type="tel"
              name="contact"
              value={employee.contact}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full focus:outline-none text-sm text-gray-800 bg-transparent"
              required
            />
          </div>
        </div>

        <button
          onClick={() => {
            handleSubmit();
            open(false);
          }}
          className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
