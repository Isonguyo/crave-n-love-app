export const formatNaira = (n: number) =>
  "₦" + Math.round(n).toLocaleString("en-NG");

export const WHATSAPP_NUMBER = "2349137573517";

export const buildWhatsAppUrl = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
