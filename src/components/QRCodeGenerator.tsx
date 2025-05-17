import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import styles from "./QRCodeGenerator.module.css";

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
  const [lastGenerated, setLastGenerated] = useState<number>(Date.now());

  // Function to format the current date (Month DD, YYYY)
  const formatCurrentDate = (): string => {
    const now = new Date();
    return now.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Function to format the current time for QR code data in UTC
  const formatTimeForQrCodeInUTC = (): string => {
    const now = new Date();
    const month = String(now.getUTCMonth() + 1).padStart(2, "0");
    const day = String(now.getUTCDate()).padStart(2, "0");
    const year = now.getUTCFullYear();
    const hours = String(now.getUTCHours()).padStart(2, "0");
    const minutes = String(now.getUTCMinutes()).padStart(2, "0");
    const seconds = String(now.getUTCSeconds()).padStart(2, "0");

    return `${month}${day}${year}-${hours}${minutes}${seconds}`;
  };

  // Function to check if the last generated time is more than 30 minutes ago
  const shouldGenerateNewQr = (): boolean => {
    const now = Date.now();
    return now - lastGenerated > 30 * 60 * 1000;
  };

  // Generate the QR code value with UTC timestamp
  const generateQrValue = (): void => {
    try {
      const formattedDate = formatCurrentDate();
      setCurrentDate(formattedDate);

      // Format: MEMBER_ID/mobile/05132025-162158 (now using UTC)
      const formattedTimeForQr = formatTimeForQrCodeInUTC();
      const value = `${memberId}/mobile/${formattedTimeForQr}`;
      setQrValue(value);
      setLastGenerated(Date.now());

      console.log("Generated QR code value with UTC timestamp:", value);
    } catch (error) {
      console.error("Error generating QR code value:", error);
    }
  };

  // Event handler for visibility change
  const handleVisibilityChange = (): void => {
    if (document.visibilityState === "visible" && shouldGenerateNewQr()) {
      generateQrValue();
    }
  };

  // Event handler for focus
  const handleFocus = (): void => {
    if (shouldGenerateNewQr()) {
      generateQrValue();
    }
  };

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
  }, [lastGenerated]);

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
