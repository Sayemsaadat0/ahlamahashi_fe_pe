import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a 16-character ID with today's date and random uppercase alphanumeric characters
 * Format: YYYYMMDD + 8 random uppercase letters/numbers
 * @returns {string} 16-character uppercase ID
 */
export function generateGuestId(): string {
  // Get today's date in YYYYMMDD format
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const dateString = `${year}${month}${day}`; // 8 characters

  // Generate 8 random uppercase alphanumeric characters
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomString = '';
  for (let i = 0; i < 8; i++) {
    randomString += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  // Combine date and random string (total 16 characters)
  return `${dateString}${randomString}`.toUpperCase();
}




export function encode256(data: any) {
  // Convert object → string
  const json = JSON.stringify(data);

  // Base64 encode
  const base = Buffer.from(json).toString("base64");

  // Make it fixed 256 characters (pad with "_")
  return base.padEnd(256, "_");
}




export function decode256(encoded: string) {
  const cleaned = encoded.replace(/X+$/, ""); // remove padding
  return Buffer.from(cleaned, "base64").toString("utf8");
}
