import { create } from 'zustand';
import { persist } from 'zustand/middleware';


type City = {
  id: number;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
};

type DeliveryAddress = {
  id: number;
  user_id: number;
  city_id: number;
  state: string;
  zip_code: string;
  street_address: string;
  created_at: string;
  updated_at: string;
  city: City;
};

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    delivery_address: DeliveryAddress | null;
    created_at: string;
    updated_at: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    setAuth: (data: { user: User; access_token: string }) => void;
    removeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            setAuth: ({ user, access_token }) => set({ user, token: access_token }),
            removeAuth: () => set({ user: null, token: null }),
        }),
        {
            name: 'auth-storage',
        }
    )
);
