import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { encode } from 'uqr';
import styles from './QRCodeGenerator.module.css';

// Constants
const REFRESH_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes in milliseconds

const QRCodeGenerator: React.FC = () => {
  const [qrValue, setQrValue] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [memberId] = useState<string>('MEMBER_ID');
  const [name] = useState<string>('Chris Lloyd-Jones');
  const [lastGenerated, setLastGenerated] = useState<number>(Date.now());
  // false = normal (gym) payload, true = member-id-only (spa scanner)
  const [scanMode, setScanMode] = useState<boolean>(false);

  // Function to format the current date (Month DD, YYYY)
  const formatCurrentDate = useCallback((): string => {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  }, []);

  // Function to format the current time for QR code data in UTC
  const formatTimeForQrCodeInUTC = useCallback((): string => {
    const now = new Date();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const year = now.getUTCFullYear();
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');

    return `${month}${day}${year}-${hours}${minutes}${seconds}`;
  }, []);

  // Function to check if the last generated time is more than 30 minutes ago
  const isQrCodeExpired = useCallback((): boolean => {
    const now = Date.now();
    return now - lastGenerated > REFRESH_INTERVAL_MS;
  }, [lastGenerated]);

  // Generate the QR code value with UTC timestamp
  const generateQrValue = useCallback((): void => {
    try {
      // Only regenerate if it's time to do so
      if (!qrValue || isQrCodeExpired()) {
        const formattedDate = formatCurrentDate();
        setCurrentDate(formattedDate);

        // Normal: [memberId]/mobile/MMDDYYYY-HHMMSS (UTC)
        // Scan mode: [memberId] only (spa scanner rejects the /mobile/date suffix)
        const value = scanMode
          ? memberId
          : `${memberId}/mobile/${formatTimeForQrCodeInUTC()}`;
        setQrValue(value);
        setLastGenerated(Date.now());
      }
    } catch (error) {
      console.error('Error generating QR code value:', error);
    }
  }, [
    formatCurrentDate,
    formatTimeForQrCodeInUTC,
    isQrCodeExpired,
    memberId,
    qrValue,
    scanMode,
  ]);

  // Toggle between normal and spa (member-id-only) payloads, regenerating the
  // QR immediately rather than waiting for the 30-minute expiry window.
  const toggleScanMode = useCallback((): void => {
    setScanMode((prev) => {
      const next = !prev;
      const value = next
        ? memberId
        : `${memberId}/mobile/${formatTimeForQrCodeInUTC()}`;
      setQrValue(value);
      setLastGenerated(Date.now());
      return next;
    });
  }, [memberId, formatTimeForQrCodeInUTC]);

  // QR module matrix rendered as a single SVG path (quiet zone comes
  // from the white card padding, so no border modules are needed)
  const qrModules = useMemo(() => {
    if (!qrValue) return null;
    const { size, data } = encode(qrValue, { ecc: 'H', border: 0 });
    let path = '';
    data.forEach((row, y) => {
      row.forEach((dark, x) => {
        if (dark) {
          path += `M${x} ${y}h1v1h-1z`;
        }
      });
    });
    return { size, path };
  }, [qrValue]);

  // Event handler for visibility change
  const handleVisibilityChange = useCallback((): void => {
    if (document.visibilityState === 'visible' && isQrCodeExpired()) {
      generateQrValue();
    }
  }, [generateQrValue, isQrCodeExpired]);

  // Event handler for focus
  const handleFocus = useCallback((): void => {
    if (isQrCodeExpired()) {
      generateQrValue();
    }
  }, [generateQrValue, isQrCodeExpired]);

  // Initialize QR code and set up refresh interval
  useEffect(() => {
    // Generate initial QR code
    generateQrValue();

    // Update every 30 minutes
    const intervalId = setInterval(generateQrValue, REFRESH_INTERVAL_MS);

    // Add event listeners for visibility change and focus
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // Clean up interval and event listeners on component unmount
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [generateQrValue, handleVisibilityChange, handleFocus]); // Added dependencies

  return (
    <div className={styles.membershipCard}>
      <div className={styles.header}>
        <div className={styles.backButton}>
          <svg
            width="16"
            height="14"
            viewBox="0 0 16 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M14 7H2.5M2.5 7L7.5 2M2.5 7l5 5"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2>Club Pass</h2>
      </div>

      <div className={styles.memberInfo}>
        <h1>{name}</h1>
        <p className={styles.date}>{currentDate}</p>
      </div>

      <div className={styles.qrCodeContainer}>
        <div className={styles.cogTopRight} />
        <div className={styles.cogTopLeft} />
        <div className={styles.cogBottomRight} />

        <div className={styles.qrCodeWrapper}>
          {qrModules ? (
            <svg
              className={styles.qrCode}
              width={220}
              height={220}
              viewBox={`0 0 ${qrModules.size} ${qrModules.size}`}
              shapeRendering="crispEdges"
              role="img"
              aria-label="Club pass QR code"
            >
              <path d={qrModules.path} fill="#000" />
            </svg>
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
        Have an awesome workout, Chris!
        <br />
        You got this!
      </p>

      <button
        type="button"
        className={`${styles.referButton} ${
          scanMode ? styles.referButtonActive : ''
        }`}
        onClick={toggleScanMode}
        aria-pressed={scanMode}
      >
        <svg
          className={styles.referIcon}
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {scanMode ? (
            <>
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </>
          ) : (
            <>
              <path d="M20.5 8.9A9 9 0 1 1 15.1 3.5" />
              <circle cx="12" cy="10" r="3.2" />
              <path d="M6.2 18.9a7.5 7.5 0 0 1 11.6 0" />
              <path d="M18.6 2.8v5.2M16 5.4h5.2" />
            </>
          )}
        </svg>
        Refer a Friend
      </button>
    </div>
  );
};

export default QRCodeGenerator;
