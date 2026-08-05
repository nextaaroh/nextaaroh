const UPI_PATTERN = /\b[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{3,}\b/;
const PHONE_PATTERN = /(\+?91[\s-]?)?[6-9]\d{9}\b/;
const IFSC_PATTERN = /\b[A-Z]{4}0[A-Z0-9]{6}\b/;
const BANK_ACCOUNT_PATTERN = /\b\d{9,18}\b/;
const KEYWORD_PATTERN = /\b(upi|qr code|paytm|phonepe|gpay|google pay|bank account|ifsc|account number|whatsapp|call me|contact me)\b/i;

export function containsContactInfo(text: string): boolean {
  if (!text) return false;
  return (
    UPI_PATTERN.test(text) ||
    PHONE_PATTERN.test(text) ||
    IFSC_PATTERN.test(text) ||
    BANK_ACCOUNT_PATTERN.test(text) ||
    KEYWORD_PATTERN.test(text)
  );
}

export function maskContactInfo(text: string): string {
  return text
    .replace(UPI_PATTERN, "[removed]")
    .replace(PHONE_PATTERN, "[removed]")
    .replace(IFSC_PATTERN, "[removed]")
    .replace(KEYWORD_PATTERN, "[removed]");
}