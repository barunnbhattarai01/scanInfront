import QRCodeGenerator from "../../qr/components/QRCodeGenerator";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";

export default function PdfFile({
  eventId,
  attendee_id,
  username,
  email,
  phone,
  role,
}) {
  const printRef = useRef(null);

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    if (!element) {
      return;
    }

    const canvas = await html2canvas(element, {
      scale: 2,
    });
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const imgProperties = pdf.getImageProperties(data);
    console.log(imgProperties);
    console.log(pdf.internal.pageSize.getHeight());
    console.log(pdf.internal.pageSize.getWidth());

    const pdfWidth = pdf.internal.pageSize.getWidth();

    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, "PNG", 0, 0, 446, 500);
    pdf.save("examplepdf.pdf");
  };
  return (
    <>
      <div className="border rounded-2xl mb-2 flex justify-center">
        {/* main container */}
        <div ref={printRef} className=" h-120 w-110 rounded-2xl p-2 ">
          {/* container for photo and qrcanner */}
          <div className="flex flex-row justify-center gap-5 items-center mb-6  h-56 rounded-xl  px-4 mt-10">
            {/* photo */}
            <div className="">
              <img
                src={"/img/person.jpg"}
                className="w-40 h-40 object-cover"
                alt="Profile"
              />
            </div>
            {/* qrscanner */}
            <div className="">
              <QRCodeGenerator
                text={attendee_id}
                size={100}
              />
            </div>
          </div>

          <div className="flex justify-center flex-col items-center text-center">
            <p>
              {username} — Role: {role}
            </p>
            Email: {email}
            <br />
            Phone: {phone}
          </div>
        </div>

        {/* for the button */}
      </div>
      <button
        onClick={handleDownloadPdf}
        className="p-2 bg-orange-100  rounded-xl mb-2 cursor-pointer hover:scale-105 active:scale-95"
      >
        Download
      </button>
    </>
  );
}
