import React, { useState, useEffect, useCallback, useRef } from "react";
import QRCode from "react-qr-code";
import styles from "./QRCodeGenerator.module.css";
import { formatCurrentDate, formatTimeForQrCodeInUTC } from "../utils/qrCodeUtils";

// Props interface for the QR code component
interface QRCodeGeneratorProps {
  config: any;
  onConfigChange: (updatedConfig: any) => void;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = () => {
  const [qrValue, setQrValue] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [memberId] = useState<string>("MEMBER_ID");
  const [name] = useState<string>("Chris Lloyd-Jones");
  const lastGenerated = useRef<number>(Date.now());

  // Function to check if the last generated time is more than 30 minutes ago
  const shouldGenerateNewQr = (): boolean => {
    const now = Date.now();
    return now - lastGenerated.current > 30 * 60 * 1000;
  };

  // Generate the QR code value with UTC timestamp
  const generateQrValue = useCallback((): void => {
    try {
      const formattedDate = formatCurrentDate();
      setCurrentDate(formattedDate);

      // Format: MEMBER_ID/mobile/05132025-162158 (now using UTC)
      const formattedTimeForQr = formatTimeForQrCodeInUTC();
      const value = `${memberId}/mobile/${formattedTimeForQr}`;
      setQrValue(value);
      lastGenerated.current = Date.now();

      console.log("Generated QR code value with UTC timestamp:", value);
    } catch (error) {
      console.error("Error generating QR code value:", error);
    }
  }, [memberId]);

  // Event handler for visibility change
  const handleVisibilityChange = useCallback((): void => {
    if (document.visibilityState === "visible" && shouldGenerateNewQr()) {
      generateQrValue();
    }
  }, [generateQrValue]);

  // Event handler for focus
  const handleFocus = useCallback((): void => {
    if (shouldGenerateNewQr()) {
      generateQrValue();
    }
  }, [generateQrValue]);

  // Initialize QR code and set up refresh interval
  useEffect(() => {
    // Generate initial QR code
    generateQrValue();

    // Update every 30 minutes
    const intervalId = setInterval(() => {
      if (shouldGenerateNewQr()) {
        generateQrValue();
      }
    }, 30 * 60 * 1000);

    // Add event listeners for visibility change and focus
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    // Clean up interval and event listeners on component unmount
    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [generateQrValue, handleVisibilityChange, handleFocus]);

  return (
    <div className={styles.membershipCard}>
      <div className={styles.header}>
        <div className={styles.backButton}>
          <span>←</span>
        </div>
        <h2>Club Pass</h2>
      </div>

      <div className={styles.memberInfo}>
        <h1>{name}</h1>
        <p className={styles.date}>{currentDate}</p>
      </div>

      <div className={styles.qrCodeContainer}>
        <div className={styles.cogTopRight}></div>
        <div className={styles.cogTopLeft}></div>
        <div className={styles.cogBottomRight}></div>

        <div className={styles.qrCodeWrapper}>
          {qrValue ? (
            <QRCode
              value={qrValue}
              size={200}
              level="H"
              className={styles.qrCode}
            />
          ) : (
            <p className={styles.loading}>Loading QR code...</p>
          )}
        </div>
      </div>

      <p className={styles.memberId}>{memberId}</p>

      <div className={styles.membershipInfo}>
        <h2 className={styles.cardType}>
          PF Black Card<sup>®</sup>
        </h2>
        <p className={styles.membershipText}>Membership</p>
      </div>

      <p className={styles.message}>
        Have an awesome workout, Chris! You got this!
      </p>

      <button className={styles.referButton}>
        <span className={styles.referIcon}>👥</span> Refer a Friend
      </button>
    </div>
  );
};

export default QRCodeGenerator;
