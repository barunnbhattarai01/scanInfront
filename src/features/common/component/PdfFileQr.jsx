import {
  Page,
  Document,
  StyleSheet,
  Image,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import QRCode from "qrcode";

// PdfDocument: 1 QR per page
const PdfDocument = ({ attendees, size }) => {
  const pageSize = [size, size]; // 60px x 60px in points

  const styles = StyleSheet.create({
    page: {
      width: size,
      height: size,
      padding: 0,
      margin: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    qrImage: {
      width: size,
      height: size,
      objectFit: "contain",
    },
  });

  return (
    <Document>
      {attendees.map((att, i) => (
        <Page key={i} size={pageSize} style={styles.page}>
          <Image src={att.qrUrl} style={styles.qrImage} />
        </Page>
      ))}
    </Document>
  );
};

// Main Component
export default function PdfFileQr({ attendees = [], size = 60 }) {
  const [processedAttendees, setProcessedAttendees] = useState([]);

  useEffect(() => {
    const generateQRCodes = async () => {
      const dataWithQR = await Promise.all(
        attendees.map(async (att) => {
          const qrUrl = await QRCode.toDataURL(att.attendee_id);
          return { ...att, qrUrl };
        })
      );
      setProcessedAttendees(dataWithQR);
    };

    if (attendees.length) generateQRCodes();
  }, [attendees]);

  if (!processedAttendees.length) return <p>Generating PDF...</p>;

  return (
    <div className="flex flex-col items-center gap-4 mt-4">
      <PDFDownloadLink
        document={
          <PdfDocument
            attendees={processedAttendees}
            size={80} // hardcoded 60px page size
          />
        }
        fileName="QR_Codes_Square.pdf"
      >
        {({ loading }) => (
          <button className="p-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:scale-105 active:scale-95">
            {loading ? "Generating PDF..." : "Download QR PDF"}
          </button>
        )}
      </PDFDownloadLink>
    </div>
  );
}
