"use client";

import { useEffect, useRef, useCallback } from "react";
import { useGuestStore } from "@/store/GuestStore";
import { useCreateVisitorSession } from "@/hooks/visitor.hooks";
import { getDeviceType, getBrowserType } from "@/lib/deviceDetection";

/**
 * VisitorTracker Component
 * 
 * Automatically tracks visitors when:
 * - Guest ID is available
 * - Device and browser are detected
 * 
 * Prevents duplicate tracking using:
 * - Session-level refs
 * - localStorage flags
 * - Validation checks
 */
export default function VisitorTracker() {
  const { guestId, _hasHydrated } = useGuestStore();
  const { mutate: createVisitorSession } = useCreateVisitorSession();

  // Refs to prevent duplicate tracking
  const hasTrackedVisitor = useRef(false);
  const isTrackingInProgress = useRef(false);

  // Get device and browser info
  const deviceType = typeof window !== "undefined" ? getDeviceType() : "unknown";
  const browserType = typeof window !== "undefined" ? getBrowserType() : "Other";

  const handleTrackingError = (error: unknown) => {
    const isHtmlString =
      typeof error === "string" &&
      (error.trim().startsWith("<!DOCTYPE") || error.trim().startsWith("<html"));

    if (error instanceof Error) {
      console.error("Failed to track visitor:", error.message);
      if ((error as any).status || (error as any).url) {
        console.error("Error details:", {
          status: (error as any).status,
          url: (error as any).url,
        });
      }
    } else if (typeof error === "object" && error !== null) {
      console.error("Failed to track visitor:", error);
    } else if (!isHtmlString) {
      console.error("Failed to track visitor:", error);
    } else {
      console.warn("Visitor tracking failed with an HTML error response.");
    }
  };

  // Track visitor function - memoized with useCallback
  const trackVisitor = useCallback(async () => {
    // 1. Check if already tracked in this session
    if (hasTrackedVisitor.current) {
      return;
    }

    // 2. Check if tracking is in progress
    if (isTrackingInProgress.current) {
      return;
    }

    // 3. Validate required data
    if (!guestId) {
      return;
    }

    if (!deviceType || deviceType === "unknown") {
      return;
    }

    if (!browserType) {
      return;
    }

    // 4. Check localStorage for previous tracking
    const trackingKey = `visitor_tracked_${guestId}`;
    const alreadyTracked = typeof window !== "undefined" 
      ? localStorage.getItem(trackingKey) === "true"
      : false;

    if (alreadyTracked) {
      hasTrackedVisitor.current = true;
      return;
    }

    // 5. Mark as tracking in progress
    isTrackingInProgress.current = true;

    try {
      // 6. Get referral source from URL
      let ref = "direct";
      if (typeof window !== "undefined") {
        try {
          const urlParams = new URLSearchParams(window.location.search);
          ref = urlParams.get("ref") || "direct";
        } catch {
          ref = "direct";
        }
      }

      // 7. Create session data
      const sessionData = {
        visitor_id: guestId,
        ref: ref !== "direct" ? ref : undefined,
        device_type: deviceType,
        browser: browserType,
      };

      // 8. Call API to create visitor session
      createVisitorSession(sessionData, {
        onSuccess: () => {
          // 9. Mark as tracked in localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem(trackingKey, "true");
          }
          hasTrackedVisitor.current = true;
          isTrackingInProgress.current = false;
        },
        onError: (error: unknown) => {
          handleTrackingError(error);
          isTrackingInProgress.current = false;
        },
      });
    } catch (error) {
      console.error("Error tracking visitor:", error);
      isTrackingInProgress.current = false;
    }
  }, [guestId, deviceType, browserType, createVisitorSession]);

  // Auto-track when all conditions are met
  useEffect(() => {
    // Wait for hydration
    if (!_hasHydrated) {
      return;
    }

    // Wait for guest ID
    if (!guestId) {
      return;
    }

    // Track visitor
    trackVisitor();
  }, [_hasHydrated, guestId, trackVisitor]);

  // This component doesn't render anything
  return null;
}

