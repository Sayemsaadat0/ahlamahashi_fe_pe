import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CityInfo {
  id: number;
  name: string;
}

interface AddressState {
  street: string;
  city: CityInfo | null;
  state: string;
  zipCode: string;
  setAddress: (address: {
    street: string;
    city: CityInfo | null;
    state: string;
    zipCode: string;
  }) => void;
  clearAddress: () => void;
}

export const useAddressStore = create<AddressState>()(
  persist(
    (set) => ({
      street: '',
      city: null,
      state: '',
      zipCode: '',
      setAddress: (address) => set(address),
      clearAddress: () => set({
        street: '',
        city: null,
        state: '',
        zipCode: '',
      }),
    }),
    {
      name: 'address-storage',
    }
  )
);

