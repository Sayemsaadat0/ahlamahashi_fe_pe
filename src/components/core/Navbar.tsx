"use client";

import { motion } from "framer-motion";
import {
  Search,
  ShoppingBag,
  UserCircle,
  Phone,
  Mail,
  LogOutIcon,
} from "lucide-react";
import { CartDrawer } from "./CartDrawer";
import { NavbarAddressModal } from "./NavbarAddressModal";
import { NavbarSearch } from "./NavbarSearch";
import { MobileNavSearchBar } from "./MobileNavSearchBar";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "./Logo";
import { useGetCreatedCart } from "@/hooks/cart.hooks";
import { useAuthStore } from "@/store/AuthStore";
import { useLogout } from "@/hooks/auth.hooks";
import { toast } from "sonner";

export function Navbar() {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { data: cartData } = useGetCreatedCart();
  // console.log(cartData);
  const { token, removeAuth } = useAuthStore();
  const cartItemsCount = cartData?.data?.items?.length || 0;

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isTopBarVisible = scrollY < 100;

  const { mutateAsync } = useLogout();

  const handleLogout = async () => {
    const result = await mutateAsync();
    if (result.success) {
      removeAuth();
      toast.success("Logged out successfully");
    } else {
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="sticky top-0 z-50">
      {/* Top Bar - Contact Info & Payment Icons */}
      <motion.div
        className="bg-white border-b border-gray-200 overflow-hidden"
        initial={{ height: "auto", opacity: 1 }}
        animate={{
          height: isTopBarVisible ? "auto" : 0,
          opacity: isTopBarVisible ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="max-w-[1020px] mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-8 text-xs">
            {/* Left: Phone & Email */}
            <div className="flex items-center gap-4 text-gray-700">
              <a
                href="tel:+1234567890"
                className="flex items-center gap-1.5 hover:text-a-green-600 transition-colors"
              >
                <Phone className="w-3 h-3" />
                <span className="hidden sm:inline">+1 (234) 567-890</span>
                <span className="sm:hidden">Call</span>
              </a>
              <a
                href="mailto:info@example.com"
                className="flex items-center gap-1.5 hover:text-a-green-600 transition-colors"
              >
                <Mail className="w-3 h-3" />
                <span className="hidden sm:inline">info@example.com</span>
                <span className="sm:hidden">Email</span>
              </a>
            </div>

            {/* Right: Payment Icons */}
            <div className="flex items-center gap-2">
              <span className="hidden lg:inline text-xs text-gray-600 mr-1">
                We accept:
              </span>
              <div className="flex items-center gap-1.5">
                <Image
                  src="/payments/visa.svg"
                  alt="Visa"
                  width={24}
                  height={16}
                  className="h-3.5 w-auto object-contain"
                />
                <Image
                  src="/payments/mastercard.svg"
                  alt="Mastercard"
                  width={24}
                  height={16}
                  className="h-3.5 w-auto object-contain"
                />
                <Image
                  src="/payments/amex.svg"
                  alt="American Express"
                  width={24}
                  height={16}
                  className="h-3.5 w-auto object-contain"
                />
                <Image
                  src="/payments/discover.svg"
                  alt="Discover"
                  width={24}
                  height={16}
                  className="h-3.5 w-auto object-contain hidden sm:block"
                />
                <Image
                  src="/payments/paypal.svg"
                  alt="PayPal"
                  width={24}
                  height={16}
                  className="h-3.5 w-auto object-contain hidden md:block"
                />
                <Image
                  src="/payments/applepay.svg"
                  alt="Apple Pay"
                  width={24}
                  height={16}
                  className="h-3.5 w-auto object-contain hidden lg:block"
                />
                <Image
                  src="/payments/googlepay.svg"
                  alt="Google Pay"
                  width={24}
                  height={16}
                  className="h-3.5 w-auto object-contain hidden lg:block"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Navbar */}
      <motion.nav
        className={`backdrop-blur-md border-b border-gray-200/50 shadow-sm bg-a-green-600 ${
          !isTopBarVisible ? "-translate-y-2" : ""
        }`}
      >
        <div className="max-w-[1020px] mx-auto px-4 lg:px-6 py-4 lg:py-10">
          <div className="flex items-center justify-between gap-4 relative">
            {/* Left: Navigation Links - Desktop */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link
                href="/menu"
                className="text-a-yellow-100 hover:opacity-80 transition-colors"
              >
                Menu
              </Link>
              <Link
                href="/about"
                className="text-a-yellow-100 hover:opacity-80 transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-a-yellow-100 hover:opacity-80 transition-colors"
              >
                Contact Us
              </Link>
            </nav>

            {/* Logo - Left on mobile, centered on large devices */}
            <motion.div
              className="flex items-center gap-2.5 cursor-pointer lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/">
                <Logo />
              </Link>
            </motion.div>

            {/* Right: Search + Action Icons */}
            <div className="flex items-center gap-2 lg:gap-3 ml-auto">
              {/* Delivery Address Button - Desktop & Mobile */}
              <NavbarAddressModal />

              {/* Search - Desktop */}
              <NavbarSearch />

              {/* Search - Mobile */}
              <motion.button
                className="lg:hidden p-2.5 hover:bg-a-yellow-100/20 rounded-xl transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              >
                <Search className="w-5 h-5 text-a-yellow-100" />
              </motion.button>

              {/* Cart */}
              <motion.button
                className="relative p-2.5 hover:bg-a-yellow-100/20 rounded-xl transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag className="w-5 h-5 text-a-yellow-100" />
                <motion.span
                  className="absolute -top-1 -right-1 w-5 h-5 bg-a-yellow-100 text-a-green-600 text-xs rounded-full flex items-center justify-center shadow-md"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  {cartItemsCount}
                </motion.span>
              </motion.button>

              {/* User - Desktop */}
              <Link href={token ? "/profile" : "/login"}>
                <motion.button
                  className="hidden lg:flex p-2.5 hover:bg-a-yellow-100/20 rounded-xl transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <UserCircle className="w-5 h-5 text-a-yellow-100" />
                </motion.button>
              </Link>
              {token && (
                <div>
                  <button className="border p-1 rounded-full text-a-yellow-100" onClick={handleLogout}>
                    <LogOutIcon className="w-3 h-3 text-a-yellow-100"  />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Search Bar - Mobile */}
          <MobileNavSearchBar
            isOpen={isMobileSearchOpen}
            onClose={() => setIsMobileSearchOpen(false)}
          />
        </div>

        {/* Cart Drawer */}
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </motion.nav>
    </div>
  );
}

export default Navbar;
