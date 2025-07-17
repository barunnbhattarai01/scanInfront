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
  },
  divImage: {
    display: "flex",
    flexDirection: "row",
    gap: "5px",
    // alignItems: "center",
  },

  divImageAndText: {
    display: "flex",
    flexDirection: "column",
    // alignItems: "center",
    justifyContent: "center",
  },

  attendeeBox: {
    width: "32%",
    height: 150,
    margin: "px",
    borderRadius: 8,
    padding: 10,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileImage: {
    width: "80px",
    height: "70px",
    borderRadius: "0",
    marginBottom: "5px",
  },
  qrCode: {
    width: "90px",
    height: "90px",
  },
  infoText: {
    fontSize: 8,
    textAlign: "center",
    fontWeight: "800",
  },
  forInv: {
    fontSize: 8,
    textAlign: "center",
    fontWeight: "800",
    marginLeft: "25px",
    marginTop: "-5px",
  },
});

// Helper function
const splitIntoPages = (data, perPage = 15) => {
  const pages = [];
  for (let i = 0; i < data.length; i += perPage) {
    const slice = data.slice(i, i + perPage);
    while (slice.length < perPage) slice.push({ isEmpty: true });
    pages.push(slice);
  }
  return pages;
};

// Document
const PdfDocument = ({ attendees, profileImage }) => {
  const pages = splitIntoPages(attendees, 15);
  return (
    <Document>
      {pages.map((group, idx) => (
        <Page key={idx} size="A4" style={styles.page}>
          {group.map((att, i) => (
            <View key={i} style={styles.attendeeBox}>
              {!att?.isEmpty ? (
                <>
                  <View style={styles.divImage}>
                    <View style={styles.divImageAndText}>
                      <Image
                        src={"/img/person.jpg"}
                        style={styles.profileImage}
                      />
                      <Text style={styles.infoText}>
                        MR. {att?.username?.toUpperCase()}
                      </Text>
                      <Text style={styles.infoText}>Sales Director</Text>
                      <Text style={styles.infoText}>
                        Pace Logistics Pvt. Ltd.
                      </Text>
                    </View>

                    <View>
                      <Image src={att?.qrUrl} style={styles.qrCode} />
                      <Text style={styles.forInv}>INV-005</Text>
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
export default function PdfFile({ attendees = [] }) {
  const [processedAttendees, setProcessedAttendees] = useState([]);
  const profileImage =
    "/mnt/data/WhatsApp Image 2025-07-17 at 19.48.46_3ae0b241.jpg";

  useEffect(() => {
    const generateQRCodes = async () => {
      const dataWithQR = await Promise.all(
        attendees.map(async (att, idx) => {
          const qrText = `INV-${String(idx + 1).padStart(3, "0")}`;
          const qrUrl = await QRCode.toDataURL(qrText);
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
          <button className="p-2 bg-blue-500 text-white rounded-lg">
            {loading ? "Generating PDF..." : "Download PDF"}
          </button>
        )}
      </PDFDownloadLink>
    </div>
  );
}
