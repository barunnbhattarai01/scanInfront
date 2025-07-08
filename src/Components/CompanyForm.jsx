import React, { useState } from "react";

export default function CompanyForm({ open }) {
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClick = (e) => {
    console.log("Form submitted:", formData);
    // You can send this data to an API here
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-sky-50 shadow-2xl rounded-xl absolute w-full top-0">
      <div className="mb-4">
        <label htmlFor="companyName" className="block mb-1 font-medium">
          Company Name
        </label>
        <input
          type="text"
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-0"
          placeholder="Enter company name"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block mb-1 font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-0"
          placeholder="Enter email"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="phone" className="block mb-1 font-medium">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-0"
          placeholder="Enter phone number"
        />
      </div>
      <div className="flex w-full justify-center">
        <button
          onClick={() => {
            handleClick();
            open(false);
          }}
          className="bg-blue-500 text-white px-8 py-2 rounded cursor-pointer hover:bg-blue-700 hover:scale-105 active:scale-95"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
