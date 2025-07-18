import {
  Page as ReactPdfPage,
  Text,
  View,
  Document as ReactPdfDocument,
  StyleSheet,
  Image,
  PDFDownloadLink,
  PDFViewer,
  pdf,
} from "@react-pdf/renderer";
import { Document, Page as PdfJsPage } from "react-pdf";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
// import "react-pdf/dist/esm/Page/AnnotationLayer.css";
// import "react-pdf/dist/esm/Page/TextLayer.css";

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
  },
  divImageAndText: {
    display: "flex",
    flexDirection: "column",
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

    width: "93.6px",
    height: "74.4px",
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
    fontWeight: "800",
  },
  qrandtext: {
    marginTop: "-10px",
  },
  forInv: {
    fontSize: 8,
    textAlign: "center",
    fontWeight: "800",

    marginLeft: "31px",
    marginTop: "-10px",

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
const PdfDocument = ({ attendees }) => {
  const pages = splitIntoPages(attendees, 15);
  return (
    <ReactPdfDocument>
      {pages.map((group, idx) => (
        <ReactPdfPage key={idx} size="A4" style={styles.page}>
          {group.map((att, i) => (
            <View key={i} style={styles.attendeeBox}>
              {!att?.isEmpty ? (
                <>
                  <View style={styles.divImage}>
                    <View style={styles.divImageAndText}>
                      <Image src={att?.image_url} style={styles.profileImage} />
                      <Text style={styles.infoText}>
                        MR. {att?.username?.toUpperCase()}
                      </Text>
                      <Text style={styles.infoText}>Sales Director</Text>
                      <Text style={styles.infoText}>
                        Pace Logistics Pvt. Ltd.
                      </Text>
                    </View>

                    <View style={styles.qrandtext}>
                      <Image src={att?.qrUrl} style={styles.qrCode} />
                      <Text style={styles.forInv}>{att?.role}-{att?.auto_id}</Text>
                    </View>
                  </View>
                </>
              ) : (
                <></>
              )}
            </View>
          ))}
        </ReactPdfPage>
      ))}
    </ReactPdfDocument>
  );
};

export default function PdfFile({ attendees = [] }) {
  const [processedAttendees, setProcessedAttendees] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setIsMobile(
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    );

    const generateQRCodes = async () => {

      const dataWithQR = await Promise.all(
        attendees.map(async (att, idx) => {
          console.log(att)
          const qrText = `INV-${att.auto_id}`;
          const qrUrl = await QRCode.toDataURL(att.attendee_id);
          return { ...att, qrUrl, invoice: qrText };
        })
      );
      setProcessedAttendees(dataWithQR);
    };

        // Generate PDF blob for react-pdf viewer
        if (dataWithQR.length > 0) {
          const blob = await pdf(
            <PdfDocument attendees={dataWithQR} />
          ).toBlob();
          setPdfUrl(URL.createObjectURL(blob));
        }
      } finally {
        setIsGenerating(false);
      }
    };

    if (attendees.length) generateQRCodes();
  }, [attendees]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  if (isGenerating || !processedAttendees.length) {
    return <p>Generating PDF...</p>;
  }

  return (
    <div className="flex flex-col items-center gap-4 mt-4">
      {/* PDF Viewer - Different implementation for mobile/desktop */}
      {isMobile ? (
        <div style={{ width: "100%", height: "700px", overflow: "auto" }}>
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading="Loading PDF..."
          >
            {Array.from(new Array(numPages), (el, index) => (
              <div key={`page_${index + 1}`} style={{ marginBottom: "10px" }}>
                <PdfJsPage
                  pageNumber={index + 1}
                  width={600}
                  renderTextLayer={false}
                />
              </div>
            ))}
          </Document>
        </div>
      ) : (
        <PDFViewer width="100%" height="700" className="mb-4">
          <PdfDocument attendees={processedAttendees} />
        </PDFViewer>
      )}

      {/* Download button */}
      <PDFDownloadLink
        document={<PdfDocument attendees={processedAttendees} />}
        fileName="Bulk_Attendees.pdf"
      >
        {({ loading }) => (
          <button
            className="p-2 bg-blue-500 text-white rounded-lg"
            disabled={loading}
          >
            {loading ? "Preparing download..." : "Download PDF"}
          </button>
        )}
      </PDFDownloadLink>

      {isMobile && (
        <p className="text-sm text-gray-600">
          Pinch to zoom for better view. For best experience, download the PDF.
        </p>
      )}
    </div>
  )
}
