import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formatQrTimestamp, qrPayload } from './pass.ts';

// 5 Jan 2026 03:04:09 UTC: every field needs zero padding
const date = new Date(Date.UTC(2026, 0, 5, 3, 4, 9));

test('timestamp is MMDDYYYY-HHMMSS in UTC', () => {
  assert.equal(formatQrTimestamp(date), '01052026-030409');
});

test('gym payload carries the timestamp, spa payload is the bare ID', () => {
  assert.equal(
    qrPayload('ABC123', date, false),
    'ABC123/mobile/01052026-030409'
  );
  assert.equal(qrPayload('ABC123', date, true), 'ABC123');
});
