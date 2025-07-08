import { useState } from "react";
import Form from "./mainfrom";
import { Plus } from "lucide-react";
import EmployeeForm from "./Employee";

export default function Mainbar() {
  const [open, setOpen] = useState(false);
  const [employee, setEmployee] = useState(false);
  return (
    <>
      {/* main container */}
      <div className="relative">
        <div className="bg-white w-screen mt-4 p-4 flex justify-between items-center">
          {/* button  */}

          <button
            className="bg-indigo-400 rounded-xl px-5 py-2 font-semibold cursor-pointer"
            onClick={() => {
              setOpen((pre) => !pre);
            }}
          >
            New
          </button>

          <button
            className="bg-indigo-400 rounded-xl px-5 py-2 font-semibold cursor-pointer flex flex-row gap-2 items-center"
            onClick={() => {
              setEmployee((pre) => !pre);
            }}
          >
            <Plus size={20} /> Add Employee
          </button>
        </div>
        {employee && <EmployeeForm open={setEmployee} />}
        {open && <Form />}
      </div>
    </>
  );
}
