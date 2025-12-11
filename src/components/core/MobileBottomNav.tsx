'use client';

import { Home, Utensils, Info, Phone, UserCircle } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/AuthStore';

export function MobileBottomNav() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('home');
  const { token } = useAuthStore();

  // Determine active tab based on pathname
  const getActiveTab = () => {
    if (pathname === '/') return 'home';
    if (pathname === '/menu') return 'menu';
    if (pathname === '/about') return 'about';
    if (pathname === '/contact') return 'contact';
    if (pathname === '/profile') return 'profile';
    return activeTab;
  };

  const currentActiveTab = getActiveTab();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-bottom">
      <div className="grid grid-cols-5 h-16 gap-1 p-1">
        <Link
          href="/"
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center gap-1 rounded-xl transition-all ${
            currentActiveTab === 'home'
              ? 'bg-a-green-600 text-white shadow-lg shadow-a-green-600/30'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs">Home</span>
        </Link>

        <Link
          href="/menu"
          onClick={() => setActiveTab('menu')}
          className={`flex flex-col items-center justify-center gap-1 rounded-xl transition-all ${
            currentActiveTab === 'menu'
              ? 'bg-a-green-600 text-white shadow-lg shadow-a-green-600/30'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Utensils className="w-5 h-5" />
          <span className="text-xs">Menu</span>
        </Link>

        <Link
          href="/about"
          onClick={() => setActiveTab('about')}
          className={`flex flex-col items-center justify-center gap-1 rounded-xl transition-all ${
            currentActiveTab === 'about'
              ? 'bg-a-green-600 text-white shadow-lg shadow-a-green-600/30'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Info className="w-5 h-5" />
          <span className="text-xs">About</span>
        </Link>

        <Link
          href="/contact"
          onClick={() => setActiveTab('contact')}
          className={`flex flex-col items-center justify-center gap-1 rounded-xl transition-all ${
            currentActiveTab === 'contact'
              ? 'bg-a-green-600 text-white shadow-lg shadow-a-green-600/30'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Phone className="w-5 h-5" />
          <span className="text-xs">Contact</span>
        </Link>

        <Link
          href={token ? "/profile" : "/login"}
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center gap-1 rounded-xl transition-all ${
            currentActiveTab === 'profile'
              ? 'bg-a-green-600 text-white shadow-lg shadow-a-green-600/30'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <UserCircle className="w-5 h-5" />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </div>
  );
}

