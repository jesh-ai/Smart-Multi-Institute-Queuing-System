import QRCode from 'qrcode';

export async function generateQRCode(data) {
  return await QRCode.toDataURL(data);
}
