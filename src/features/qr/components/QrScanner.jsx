import React, { useRef, useEffect, useCallback, useState } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";

function QRScanner({ onScanSuccess }) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const scanInterval = useRef(null);
  const [cameraAccess, setCameraAccess] = useState(null); // null = checking, true = granted, false = denied

  // Try to request permission manually
  useEffect(() => {
    async function checkCameraPermission() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        // If permission granted, stop stream immediately
        stream.getTracks().forEach((track) => track.stop());
        setCameraAccess(true);
      } catch (err) {
        console.error("Camera permission denied or error:", err);
        setCameraAccess(false);
      }
    }

    checkCameraPermission();
  }, []);

  const captureFrameAndScan = useCallback(() => {
    const video = webcamRef.current?.video;
    const canvas = canvasRef.current;

    if (!video || video.readyState !== 4 || !canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height);

    if (code?.data) {
      onScanSuccess?.(code.data);
    }
  }, [onScanSuccess]);

  useEffect(() => {
    if (cameraAccess) {
      scanInterval.current = setInterval(captureFrameAndScan, 2000);
    }

    return () => clearInterval(scanInterval.current);
  }, [captureFrameAndScan, cameraAccess]);

  return (
    <div className="flex justify-center items-center h-90 flex-col gap-2">
      {cameraAccess === null && <p>Requesting camera permission...</p>}
      {cameraAccess === false && (
        <div className="text-red-500 text-center">
          <p>Camera access denied.</p>
          <p>Please allow camera access in your browser settings.</p>
        </div>
      )}
      {cameraAccess && (
        <>
          <p>Scanning the QR, please wait</p>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "environment" }}
            style={{ width: "200px" }}
            className="border-1 border-b-blue-800"
          />
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <p>Keep the QR in the center</p>
        </>
      )}
    </div>
  );
}

export default QRScanner;
