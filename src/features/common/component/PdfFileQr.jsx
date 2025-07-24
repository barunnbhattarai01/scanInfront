import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import QRCode from "qrcode";

const PdfDocument = ({ attendees, size, styles }) => {
  return (
    <Document>
      <Page wrap size="A4" style={styles.page} break={true}>
        {attendees.map((att, i) => (
          <View style={styles.attendeeBox}>
            <View style={styles.qrandtext}>
              <Image
                src={att?.qrUrl}
                style={{ height: `${size}px`, width: `${size}px` }}
              />
              <Text style={styles.forInv}>
                {att?.role}-{att?.auto_id}
              </Text>
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
};

// Main Component
export default function PdfFileQr({ attendees = [], size }) {
  const newsize = size + 10;
  const styles = StyleSheet.create({
    page: {
      flexDirection: "row",
      flexWrap: "wrap",
      padding: "10px",
      justifyContent: "flex-start",
      alignItems: "flex-start",
    },

    attendeeBox: {
      minHeight: 120,
    },

    qrandtext: {
      flexDirection: "column",
      alignItems: "center",
    },
    qrImage: {
      height: `${size}px`,
      width: `${size}px`,
      objectFit: "contain",
    },
    forInv: {
      fontSize: 9,
      textAlign: "center",
      marginTop: 4,
      fontWeight: 500,
    },
  });

  const [processedAttendees, setProcessedAttendees] = useState([]);
  const profileImage =
    "/mnt/data/WhatsApp Image 2025-07-17 at 19.48.46_3ae0b241.jpg";

  useEffect(() => {
    const generateQRCodes = async () => {
      const dataWithQR = await Promise.all(
        attendees.map(async (att, idx) => {
          const qrText = `${String(idx + 1).padStart(3, "0")}`;
          const qrUrl = await QRCode.toDataURL(att.attendee_id);
          return { ...att, qrUrl, invoice: qrText };
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
            styles={styles}
            size={size}
            attendees={processedAttendees}
            profileImage={profileImage}
          />
        }
        fileName="Bulk_Attendees.pdf"
      >
        {({ loading }) => (
          <button className="p-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:scale-105 active:scale-95">
            {loading ? "Generating PDF..." : "Download PDF"}
          </button>
        )}
      </PDFDownloadLink>
    </div>
  );
}
