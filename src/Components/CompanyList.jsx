import { useState } from "react";

export default function CompanyList({ company }) {
  const [companyName, setCompanyName] = useState("");

  function handleClick(id) {
    setCompanyName(id);
  }

  return (
    <>
      {/* main container */}
      <div
        className="bg-gray-400 flex flex-row gap-2 rounded-xs px-2 hover:bg-gray-700 text-white w-full border-1 border-black"
        onClick={() => {
          handleClick(company.id);
        }}
      >
        <p>{company.id}</p>

        <p>{company.name}</p>
      </div>
    </>
  );
}
