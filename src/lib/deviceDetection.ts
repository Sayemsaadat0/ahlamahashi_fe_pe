/**
 * Device and Browser Detection Utilities
 * Detects device type and browser from user agent string
 */

export type DeviceType = "mobile" | "tablet" | "desktop" | "unknown";

/**
 * Detects device type from user agent string
 * @param userAgent - Optional user agent string (defaults to navigator.userAgent)
 * @returns Device type: "mobile" | "tablet" | "desktop" | "unknown"
 */
export function getDeviceType(userAgent?: string): DeviceType {
  if (typeof window === "undefined") return "unknown";
  
  const ua = userAgent || navigator.userAgent;

  // Tablet detection (must come before mobile)
  const tabletRegex = /iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i;
  if (tabletRegex.test(ua)) {
    return "tablet";
  }

  // Mobile detection
  const mobileRegex =
    /Mobi|Android|iPhone|iPod|BlackBerry|Opera Mini|IEMobile|WPDesktop/i;
  if (mobileRegex.test(ua)) {
    return "mobile";
  }

  // Desktop detection
  const desktopRegex = /Windows|Macintosh|Linux|X11/i;
  if (desktopRegex.test(ua)) {
    return "desktop";
  }

  return "unknown";
}

/**
 * Detects browser type from user agent string
 * @param userAgent - Optional user agent string (defaults to navigator.userAgent)
 * @returns Browser name: "Firefox" | "Chrome" | "Safari" | "Edge" | "Opera" | "Other"
 */
export function getBrowserType(userAgent?: string): string {
  if (typeof window === "undefined") return "Other";
  
  const ua = userAgent || navigator.userAgent;

  // Firefox
  if (/firefox\/\d+/i.test(ua)) {
    return "Firefox";
  }

  // Edge
  if (/edg\/\d+/i.test(ua)) {
    return "Edge";
  }

  // Opera
  if (/opr\/\d+/i.test(ua)) {
    return "Opera";
  }

  // Chrome (must come before Safari)
  if (/chrome\/\d+/i.test(ua) && !/edg\/\d+/i.test(ua)) {
    return "Chrome";
  }

  // Safari (must not be Chrome or Chromium)
  if (/safari\/\d+/i.test(ua) && !/chrome\/\d+/i.test(ua)) {
    return "Safari";
  }

  return "Other";
}

