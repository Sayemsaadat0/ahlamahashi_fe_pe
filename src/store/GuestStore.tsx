import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateGuestId } from '@/lib/utils';

interface GuestState {
  guestId: string | null;
  generateGuestId: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useGuestStore = create<GuestState>()(
  persist(
    (set) => ({
      guestId: null,
      _hasHydrated: false,
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },
      generateGuestId: () => {
        // Always generate a new guest ID and update the store
        const newGuestId = generateGuestId();
        set({ guestId: newGuestId });
        return newGuestId;
      },
    }),
    {
      name: 'guest-storage',
      onRehydrateStorage: () => (state) => {
        // After rehydration, check if guestId exists, if not generate one
        if (state) {
          state.setHasHydrated(true);
          if (!state.guestId) {
            const newGuestId = generateGuestId();
            state.guestId = newGuestId;
            // Update the store with the new ID
            setTimeout(() => {
              useGuestStore.setState({ guestId: newGuestId });
            }, 0);
          }
        }
      },
    }
  )
);

