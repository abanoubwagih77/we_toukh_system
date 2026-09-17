import QRCode from 'qrcode';

export async function generateQrCodeDataUrl(studentId: string, studentName?: string): Promise<string> {
  try {
    // Generate QR payload containing student identification
    const payload = JSON.stringify({
      schema: 'we-tech-school-v1',
      studentId,
      studentName,
      timestamp: Date.now(),
      verificationUrl: `${window.location.origin}/?student=${encodeURIComponent(studentId)}`
    });

    return await QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 320,
      color: {
        dark: '#4A154B', // WE Egyptian Telecom signature purple
        light: '#FFFFFF'
      }
    });
  } catch (err) {
    console.error('Failed to generate QR Code:', err);
    return '';
  }
}

export function parseQrCodePayload(rawText: string): { studentId: string; valid: boolean } {
  if (!rawText) return { studentId: '', valid: false };

  // Check if it's JSON formatted
  try {
    const parsed = JSON.parse(rawText);
    if (parsed.studentId) {
      return { studentId: parsed.studentId, valid: true };
    }
  } catch {
    // Not json, check if raw ID like WE-2025-0101 or code
  }

  // Check if it's a URL with student parameter
  try {
    const url = new URL(rawText);
    const param = url.searchParams.get('student');
    if (param) {
      return { studentId: param, valid: true };
    }
  } catch {
    // Not a full URL
  }

  // Simple string match
  const cleaned = rawText.trim();
  if (cleaned.startsWith('WE-') || /^\d{4,6}$/.test(cleaned)) {
    return { studentId: cleaned, valid: true };
  }

  return { studentId: cleaned, valid: false };
}
