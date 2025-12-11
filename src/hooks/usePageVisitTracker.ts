"use client";

import { useCallback, useRef, useState, useEffect } from 'react';
import { useGuestStore } from '@/store/GuestStore';
import { useUpdateVisitor, PageVisit } from '@/hooks/visitor.hooks';
import { useDebounce } from './useDebounce';

/**
 * Hook for tracking page visits and section views
 * Uses Intersection Observer to detect when sections are visible
 * Tracks in_time and out_time for each section visit
 */
export function usePageVisitTracker() {
  const { guestId } = useGuestStore();
  const { mutate: updateVisitor } = useUpdateVisitor();
  
  const sectionTimers = useRef<{ 
    [key: string]: { 
      startTime: number; 
      timeoutId: NodeJS.Timeout | null;
      pageName: string;
      sectionName: string;
    } 
  }>({});
  
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const debouncedSection = useDebounce(currentSection, 500);

  /**
   * Format date to "YYYY-MM-DD HH:mm:ss" format as required by API
   */
  const formatDateTime = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  /**
   * Track a page visit for a specific section
   */
  const trackPageVisit = useCallback(async (pageName: string, sectionName: string) => {
    if (!guestId) return;

    const sectionKey = `${pageName}-${sectionName}`;
    const now = new Date();
    
    // If we have a previous section, send it with out_time
    if (sectionTimers.current[sectionKey]) {
      const { startTime, timeoutId, pageName: prevPageName, sectionName: prevSectionName } = sectionTimers.current[sectionKey];
      
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // Create page visit data with in_time and out_time
      const pageVisitData: PageVisit = {
        page_name: prevPageName,
        section_name: prevSectionName,
        in_time: formatDateTime(new Date(startTime)),
        out_time: formatDateTime(now)
      };

      // Update visitor with page visit using PATCH endpoint
      updateVisitor(
        {
          visitorId: guestId,
          data: {
            page_visits: [pageVisitData]
          }
        },
        {
          onSuccess: () => {
            console.log('Page visit tracked:', pageVisitData);
          },
          onError: (error) => {
            console.error('Failed to track page visit:', error);
          }
        }
      );
    }

    // Start tracking the new section
    sectionTimers.current[sectionKey] = {
      startTime: now.getTime(),
      timeoutId: null,
      pageName,
      sectionName
    };
  }, [guestId, updateVisitor]);

  /**
   * Handle when a section is entered (called by Intersection Observer)
   */
  const handleSectionEnter = useCallback((pageName: string, sectionName: string) => {
    setCurrentSection(`${pageName}-${sectionName}`);
  }, []);

  /**
   * Track when debounced section changes
   */
  useEffect(() => {
    if (debouncedSection && guestId) {
      const [pageName, sectionName] = debouncedSection.split('-');
      if (pageName && sectionName) {
        trackPageVisit(pageName, sectionName);
      }
    }
  }, [debouncedSection, trackPageVisit, guestId]);

  /**
   * Cleanup: Track final section when component unmounts
   */
  useEffect(() => {
    return () => {
      if (!guestId) return;
      
      // Track all active sections before unmounting
      Object.keys(sectionTimers.current).forEach((key) => {
        const timer = sectionTimers.current[key];
        if (timer && timer.startTime) {
          const now = new Date();
          const pageVisitData: PageVisit = {
            page_name: timer.pageName,
            section_name: timer.sectionName,
            in_time: formatDateTime(new Date(timer.startTime)),
            out_time: formatDateTime(now)
          };

          updateVisitor({
            visitorId: guestId,
            data: {
              page_visits: [pageVisitData]
            }
          });
        }
      });
    };
  }, [guestId, updateVisitor]);

  return { handleSectionEnter };
}

