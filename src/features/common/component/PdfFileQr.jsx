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

// Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: "5px",
    justifyContent: "center",
    alignItems: "center",
    gap: "2px",
  },
  divImage: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "5px",
    width: "100%",
  },

  divImageAndText: {
    flexDirection: "column",
    alignItems: "center",
    flexShrink: 1,
    width: "45%",
  },

  attendeeBox: {
    width: "47%",
    minHeight: 150,
    margin: "1px",
    borderRadius: 8,
    padding: "5px",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    flexShrink: 1,
  },
  profileImage: {
    width: "83px",
    height: "80px",
    borderRadius: "0",
    marginBottom: "5px",
  },
  qrCode: {
    width: "80px",
    height: "80px",
  },
  infoText: {
    fontSize: 8,
    textAlign: "center",
    wordBreak: "break-word",
    flexShrink: 1,
    width: "100%",
  },
  qrandtext: {
    flexDirection: "column",
    alignItems: "center",
    width: "45%",
    marginTop: "-1px",
  },

  forInv: {
    fontSize: 9,
    textAlign: "center",
    fontWeight: "900",
    marginTop: "2px",
    flexShrink: 1,
  },
});

// Helper function
const splitIntoPages = (data, perPage = 10) => {
  const pages = [];
  for (let i = 0; i < data.length; i += perPage) {
    const slice = data.slice(i, i + perPage);
    while (slice.length < perPage) slice.push({ isEmpty: true });
    pages.push(slice);
  }
  return pages;
};

// Document
const PdfDocument = ({ attendees }) => {
  const pages = splitIntoPages(attendees, 10);
  return (
    <Document>
      {pages.map((group, idx) => (
        <Page key={idx} size="A4" style={styles.page}>
          {group.map((att, i) => (
            <View key={i} style={styles.attendeeBox}>
              {!att?.isEmpty ? (
                <>
                  <View style={styles.divImage}>
                    <View style={styles.qrandtext}>
                      <Image src={att?.qrUrl} style={styles.qrCode} />
                      <Text style={styles.forInv}>
                        {att?.role}-{att?.auto_id}
                      </Text>
                    </View>
                  </View>
                </>
              ) : (
                <></>
              )}
            </View>
          ))}
        </Page>
      ))}
    </Document>
  );
};

// Main component
export default function PdfFileQr({ attendees = [] }) {
  const [processedAttendees, setProcessedAttendees] = useState([]);
  const profileImage =
    "/mnt/data/WhatsApp Image 2025-07-17 at 19.48.46_3ae0b241.jpg";

  useEffect(() => {
    const generateQRCodes = async () => {
      const dataWithQR = await Promise.all(
        attendees.map(async (att, idx) => {
          console.log(att);
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
