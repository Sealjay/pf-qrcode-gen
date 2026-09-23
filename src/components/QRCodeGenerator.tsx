import { useEffect, useMemo, useState } from 'preact/hooks';
import { encode } from 'uqr';
import { qrPayload } from '../pass.ts';
import styles from './QRCodeGenerator.module.css';

// Baked in at build time from .env.local or CI secrets (see README)
const MEMBER_ID: string | undefined = import.meta.env.VITE_MEMBER_ID;
const MEMBER_NAME: string | undefined = import.meta.env.VITE_MEMBER_NAME;

// Passes scan for ~2 hours after their timestamp; 30 minutes stays well inside
const REFRESH_INTERVAL_MS = 30 * 60 * 1000;

export default function QRCodeGenerator() {
  const [now, setNow] = useState(() => new Date());
  // false = normal (gym) payload, true = member-id-only (spa scanner)
  const [scanMode, setScanMode] = useState(false);

  // Fresh timestamp every 30 minutes and whenever the page comes back into view
  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === 'visible') setNow(new Date());
    };
    const intervalId = setInterval(refresh, REFRESH_INTERVAL_MS);
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  // QR module matrix rendered as a single SVG path (quiet zone comes
  // from the white card padding, so no border modules are needed)
  const qrModules = useMemo(() => {
    if (!MEMBER_ID) return null;
    const { size, data } = encode(qrPayload(MEMBER_ID, now, scanMode), {
      ecc: 'H',
      border: 0,
    });
    let path = '';
    data.forEach((row, y) => {
      row.forEach((dark, x) => {
        if (dark) {
          path += `M${x} ${y}h1v1h-1z`;
        }
      });
    });
    return { size, path };
  }, [now, scanMode]);

  if (!qrModules || !MEMBER_NAME) {
    return (
      <div className={styles.membershipCard}>
        <div className={styles.setup}>
          <h1>Almost there</h1>
          <p>
            Set <code>VITE_MEMBER_ID</code> and <code>VITE_MEMBER_NAME</code>,
            then rebuild. The README explains where to find your member ID.
          </p>
        </div>
      </div>
    );
  }

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
        <h1>{MEMBER_NAME}</h1>
        <p className={styles.date}>
          {now.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
          })}
        </p>
      </div>

      <div className={styles.qrCodeContainer}>
        <div className={styles.cogTopRight} />
        <div className={styles.cogTopLeft} />
        <div className={styles.cogBottomRight} />

        <div className={styles.qrCodeWrapper}>
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
        </div>
      </div>

      <p className={styles.memberId}>{MEMBER_ID}</p>

      <div className={styles.membershipInfo}>
        <h2 className={styles.cardType}>
          PF Black Card<sup>®</sup>
        </h2>
        <p className={styles.membershipText}>Membership</p>
      </div>

      <p className={styles.message}>
        Have an awesome workout, {MEMBER_NAME.split(' ')[0]}!
        <br />
        You got this!
      </p>

      {/* Looks like the real app's button; secretly toggles spa mode */}
      <button
        type="button"
        className={`${styles.referButton} ${
          scanMode ? styles.referButtonActive : ''
        }`}
        onClick={() => {
          setScanMode((mode) => !mode);
          setNow(new Date());
        }}
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
}
