import React, { useState } from "react";
import {
  Building2,
  Contact,
  Briefcase,
  Mail,
  Phone,
  IndianRupee,
  Star,
  Trash,
  Pencil,
} from "lucide-react";
import CompanyForm from "./CompanyForm";

const company = [
  { id: 1, name: "Flameoff" },
  { id: 2, name: "TechNova" },
  { id: 3, name: "GreenSpark" },
  { id: 4, name: "PixelCore" },
  { id: 5, name: "AetherWorks" },
];

function Form() {
  const [formData, setFormData] = useState({
    companyname: "",
    contact: "",
    opp: "",
    email: "",
    ph: "",
    amount: "",
    rating: 0,
  });

  const [open, setOpen] = useState(false);
  const [filtred, setFiltred] = useState(company);

  const [openCompany, setOpenCompany] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleRating = (value) => {
    setFormData((prev) => ({
      ...prev,
      rating: value,
    }));
  };

  const handleSubmit = () => {
    setFormData({
      companyname: "",
      contact: "",
      opp: "",
      email: "",
      ph: "",
      amount: "",
      rating: 0,
    });
    setFiltred(company);
    setOpen(false);
  };

  function handleClick(name) {
    setFormData((prev) => ({
      ...prev,
      companyname: name,
    }));

    setFiltred(company);
    setOpen(false);
  }

  return (
    <div className="bg-sky-50 p-4 w-[400px] rounded-lg shadow-md absolute left-4">
      <div className="space-y-2 mb-6 relative">
        {/* Company input with icon */}
        <div className="flex items-center gap-x-4">
          <Building2 className="text-gray-700" />
          <input
            type="text"
            placeholder="Contact Name"
            value={formData.companyname}
            onChange={(e) => {
              const value = e.target.value;
              handleChange("companyname")(e);
              setOpen(true);
              const newFiltred = company.filter((f) =>
                f.name.toLowerCase().includes(value.toLowerCase())
              );
              setFiltred(newFiltred);
            }}
            className="w-96 bg-white h-7 px-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Dropdown list */}
        {open && (
          <div className="flex flex-col bg-sky-100 left-10 w-80 absolute z-10 border border-gray-300 rounded shadow-md max-h-48 overflow-auto">
            {filtred.map((c) => (
              <div
                key={c.id}
                className="bg-gray-400 flex flex-row gap-2 rounded-xs px-2 py-1 hover:bg-gray-700 text-white cursor-pointer"
                onClick={() => handleClick(c.name)}
              >
                <p>{c.name}</p>
              </div>
            ))}

            <button
              className=" bg-cyan-200 hover:bg-cyan-400 cursor-pointer"
              onClick={() => {
                setOpenCompany(true);
                setOpen(false);
              }}
            >
              Create Company
            </button>
          </div>
        )}

        {/* form element for the company */}
        {openCompany && <CompanyForm open={setOpenCompany} />}

        {/* Contact Name input
          <div className="flex items-center gap-x-4">
            <Contact className="text-gray-700" />
            <input
              type="text"
              placeholder="Contact Name"
              value={formData.contact}
              onChange={handleChange("contact")}
              className="w-96 bg-white h-7 px-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div> */}

        {/* Opportunity input */}
        <div className="flex items-center gap-x-4">
          <Briefcase className="text-gray-700" />
          <input
            type="text"
            placeholder="Opportunity"
            value={formData.opp}
            onChange={handleChange("opp")}
            className="w-96 bg-white h-7 px-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Contact Email input */}
        <div className="flex items-center gap-x-4">
          <Mail className="text-gray-700" />
          <input
            type="email"
            placeholder="Contact Email"
            value={formData.email}
            onChange={handleChange("email")}
            className="w-96 bg-white h-7 px-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Contact Phone input */}
        <div className="flex items-center gap-x-4">
          <Phone className="text-gray-700" />
          <input
            type="tel"
            placeholder="Contact Phone"
            value={formData.ph}
            onChange={handleChange("ph")}
            className="w-96 bg-white h-7 px-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Amount and Rating */}
        <div className="flex items-center gap-x-4">
          <IndianRupee className="text-gray-700" />
          <input
            type="number"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange("amount")}
            className="w-44 bg-white h-7 px-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="flex gap-2 ml-auto">
            {[1, 2, 3].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleRating(s)}
                aria-label={`Rate ${s} star${s > 1 ? "s" : ""}`}
              >
                <Star
                  fill={s <= formData.rating ? "#facc15" : "none"}
                  stroke="#facc15"
                  className="w-6 h-6"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between">
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded transition-colors"
          >
            Add
          </button>
          <button
            type="button"
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-6 rounded transition-colors"
          >
            <Pencil />
          </button>
        </div>
        <button
          type="button"
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded transition-colors"
        >
          <Trash />
        </button>
      </div>
    </div>
  );
}

export default Form;
