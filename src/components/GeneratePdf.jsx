import PdfFile from "../features/common/component/PdfFile";
import { useState } from "react";
import PdfFileQr from "../features/common/component/PdfFileQr";

export default function GeneratePdf({
  attendees,
  eventId,
  generate,
  setGenerate,
}) {
  const [pdfgenerate, setPdfgenerate] = useState(false);
  const [filtred, setFiltred] = useState([]);
  const [type, setType] = useState("");
  const [pdfqr, setPdfqr] = useState(false);
  const [size, setSize] = useState(0);
  const [qrsizevisible, setQrsizevisible] = useState(false);
  const [range, setRange] = useState({
    start: "",
    end: "",
  });

  function handleGenerate() {
    const start = parseInt(range.start);
    const end = parseInt(range.end);

    if (!start || !end || !type.trim()) {
      alert("Please enter a valid range");
      return;
    }

    const filteredByRole = attendees.filter(
      (attendee) => attendee.role.toLowerCase() === type.toLowerCase()
    );

    if (start > end || start < 1 || end > filteredByRole.length) {
      alert(
        `Invalid range. Only ${filteredByRole.length} attendees with role ${type}`
      );
      return;
    }

    const sliced = filteredByRole.slice(start, end);
    setFiltred(sliced);
    setPdfgenerate(true);
    setGenerate(false);
  }

  function handleGenerateQR() {
    const start = parseInt(range.start);
    const end = parseInt(range.end);

    if (!start || !end || !type.trim()) {
      alert("Please enter a valid range");
      return;
    }

    const filteredByRole = attendees.filter(
      (attendee) => attendee.role.toLowerCase() === type.toLowerCase()
    );

    if (start > end || start < 1 || end > filteredByRole.length) {
      alert(
        `Invalid range. Only ${filteredByRole.length} attendees with role ${type}`
      );
      return;
    }

    const sliced = filteredByRole.slice(start, end);
    setFiltred(sliced);
    setQrsizevisible(false);
    setPdfqr(true);
    setGenerate(false);
  }

  return (
    <>
      <div className="absolute top-60 left-50 md:left-180 flex flex-col justify-center items-center">
        <div className="flex justify-center items-center">
          {!generate && (
            <button
              className="p-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:scale-105 active:scale-95"
              onClick={() => {
                setGenerate(true);
                setPdfgenerate(false);
                setPdfqr(false);
              }}
            >
              Generate PDF
            </button>
          )}
        </div>

        {generate && (
          <div className="absolute w-80 gap-4 shadow-2xl rounded-2xl bg-orange-100 p-5 flex justify-center items-center flex-col ">
            <p> Enter the range</p>
            <div className="flex flex-row gap-2 items-center justify-center">
              Type:
              <input
                type="text"
                className="  w-15 focus:ring-3 focus:ring-orange-400 outline-none transition-all bg-blue-300 px-2 py-1"
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-row gap-2">
              from:{" "}
              <input
                type="number"
                className="  w-15 px-2 py-1 bg-blue-200 rounded-xs focus:ring-3 focus:ring-orange-400 outline-none transition-all "
                value={range.start}
                onChange={(e) => {
                  setRange((pre) => {
                    return {
                      ...pre,
                      start: e.target.value,
                    };
                  });
                }}
              />{" "}
              to:{" "}
              <input
                type="number"
                className=" w-15 px-2 py-1 bg-blue-200 rounded-xs focus:ring-3 focus:ring-orange-400 outline-none transition-all"
                value={range.end}
                onChange={(e) => {
                  setRange((pre) => {
                    return {
                      ...pre,
                      end: e.target.value,
                    };
                  });
                }}
              />
            </div>
            <div className="flex flex-row gap-2 justify-center items-center">
              <button
                className="px-2 py-1 bg-orange-300 rounded-xs hover:scale-105 active:scale-95 cursor-pointer"
                onClick={handleGenerate}
              >
                Generate
              </button>
              <button
                className="px-2 py-1 bg-orange-300 rounded-xs hover:scale-105 active:scale-95 cursor-pointer"
                onClick={() => {
                  setFiltred(attendees);
                  setPdfgenerate(true);
                  setGenerate(false);
                }}
              >
                Generate All
              </button>
            </div>
            <button
              className="px-2 py-1 bg-orange-300 rounded-xs   cursor-pointer"
              onClick={() => {
                setQrsizevisible(true);
              }}
            >
              Qr only pdf
            </button>

            <button
              className="px-2 py-1 bg-blue-300 rounded-xs hover:scale-105 active:scale-95 cursor-pointer"
              onClick={() => {
                setGenerate(false);
              }}
            >
              Close{" "}
            </button>
          </div>
        )}

        {qrsizevisible && (
          <div className="absolute bg-orange-500 z-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-between items-center p-10 shadow-2xl gap-2 rounded-xl">
            <input
              className="bg-violet-200 w-40 rounded-xl p-2 "
              type="number"
              placeholder="qr size"
              value={size}
              onChange={(e) => {
                setSize(e.target.value);
              }}
            />

            <button
              className="px-2 py-1 bg-orange-300 rounded-xs  cursor-pointer"
              onClick={() => {
                setQrsizevisible(false);
                handleGenerateQR();
              }}
            >
              Generate
            </button>
          </div>
        )}

        {filtred?.length > 0 ? (
          pdfgenerate && (
            <PdfFile
              attendees={filtred?.map((att) => ({
                position: att.position,
                company: att.company,
                eventId,
                attendee_id: att.attendee_id,
                username: att.full_name,
                role: att.role,
                phone: att.phone,
                image_url: att.image_url,
                auto_id: att.auto_id,
              }))}
            />
          )
        ) : (
          <p></p>
        )}

        {filtred?.length > 0 ? (
          pdfqr && (
            <PdfFileQr
              size={size}
              attendees={filtred?.map((att) => ({
                position: att.position,
                company: att.company,
                eventId,
                attendee_id: att.attendee_id,
                username: att.full_name,
                role: att.role,
                phone: att.phone,
                image_url: att.image_url,
                auto_id: att.auto_id,
              }))}
            />
          )
        ) : (
          <p></p>
        )}
      </div>
    </>
  );
}
