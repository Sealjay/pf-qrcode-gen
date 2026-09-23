// Payloads the Planet Fitness scanners accept:
// gym: [memberId]/mobile/MMDDYYYY-HHMMSS (UTC)
// spa: [memberId] only (the spa scanner rejects the /mobile/timestamp suffix)
const pad = (n: number): string => String(n).padStart(2, '0');

export function formatQrTimestamp(date: Date): string {
  const day = `${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}${date.getUTCFullYear()}`;
  const time = `${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}`;
  return `${day}-${time}`;
}

export function qrPayload(memberId: string, date: Date, spa: boolean): string {
  return spa ? memberId : `${memberId}/mobile/${formatQrTimestamp(date)}`;
}
