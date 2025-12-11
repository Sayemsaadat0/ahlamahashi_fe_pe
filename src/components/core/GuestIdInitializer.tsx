'use client';

import { useEffect, useState } from 'react';
import { useGuestStore } from '@/store/GuestStore';

/**
 * Component that initializes guest ID on app load
 * Generates a guest ID if one doesn't exist
 */
export default function GuestIdInitializer() {
  const { generateGuestId, guestId, _hasHydrated, setHasHydrated } = useGuestStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Mark as hydrated on client side
    if (!_hasHydrated) {
      setHasHydrated(true);
    }

    // Generate guest ID if it doesn't exist
    if (_hasHydrated && !guestId) {
      generateGuestId();
    }
  }, [isClient, _hasHydrated, guestId, generateGuestId, setHasHydrated]);

  // Debug: Log guest ID
  useEffect(() => {
    if (isClient && _hasHydrated && guestId) {
      console.log('Guest ID:', guestId);
    }
  }, [isClient, guestId, _hasHydrated]);

  return null;
}

