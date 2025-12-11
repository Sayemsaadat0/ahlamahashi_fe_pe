"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { useAuthStore } from "@/store/authStore";
// import { LogoIcon } from "@/components/core/icons/icons";
// import Image from "next/image";
import { useAuthStore } from "@/store/AuthStore";
import Logo from "@/components/core/Logo";

interface AuthProviderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  fallback = (
    <div className="min-h-screen flex items-center bg-t-gray justify-center">
      <div className="text-center flex flex-col items-center">
        <Logo />
        <p className="mt-4 text-gray-600 text-2xl font-bold">Loading...</p>
      </div>
    </div>
  ),
}) => {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (!user || !token || user.role !== "admin") {
        router.push("/login");
        return;
      }
      setIsChecking(false);
    };

    const timer = setTimeout(checkAuth, 100);

    return () => clearTimeout(timer);
  }, [user, token, router]);

  if (isChecking) {
    return <>{fallback}</>;
  }

  if (!user || !token || user.role !== "admin") {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default AuthProvider;
