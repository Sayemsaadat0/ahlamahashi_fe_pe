'use client';
import Link from "next/link";
import { Phone, Mail, Facebook, Twitter, Instagram,  } from "lucide-react";
// import Logo from "./Logo";
import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  const mainLinks = [
    { name: "Menu", href: "/menu" },
    { name: "Locations", href: "/locations" },
    { name: "About Us", href: "/about" },
    { name: "News", href: "/news" }
  ];

  const helpLinks = [
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" }
  ];

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" }
  ];

  return (
    <footer className="bg-a-green-600 text-a-yellow-100 overflow-hidden">
      <div className="ah-container mx-auto">
        {/* Top Section - Four Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12 py-8 sm:py-12 md:py-16">
          {/* Column 1 - Brand & Contact */}
          <div className="space-y-4 md:space-y-6 text-center md:text-left">
            {/* Logo/Icon */}
            <div className="w-fit mx-auto  md:-mx-5">
              <Image 
                src="/Logo.png" 
                alt="Logo" 
                width={120} 
                height={120}
                className=" shrink-0 "
              />
            </div>
            
            {/* Tagline */}
            <p className="text-a-yellow-100 text-xs sm:text-sm font-medium leading-relaxed">
              Life Begins<br />After Coffee
            </p>

            {/* Contact Info */}
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center gap-2 md:gap-3 text-a-yellow-100 justify-center md:justify-start">
                <Phone size={14} className="md:w-4 md:h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm break-all">+1 (212) 555-0198</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3 text-a-yellow-100 justify-center md:justify-start">
                <Mail size={14} className="md:w-4 md:h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm break-all">hello@bhaus.com</span>
              </div>
            </div>
          </div>

          {/* Column 2 - Main Navigation */}
          <div className="text-center md:text-left">
            <h3 className="text-sm sm:text-base font-semibold mb-4 md:mb-6 text-a-yellow-100">Main</h3>
            <nav className="space-y-2 md:space-y-3">
              {mainLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-a-yellow-100 hover:opacity-80 transition-opacity duration-300"
                >
                  <span className="text-xs sm:text-sm">{link.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3 - Help */}
          <div className="text-center md:text-left">
            <h3 className="text-sm sm:text-base font-semibold mb-4 md:mb-6 text-a-yellow-100">Help</h3>
            <nav className="space-y-2 md:space-y-3">
              {helpLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-a-yellow-100 hover:opacity-80 transition-opacity duration-300"
                >
                  <span className="text-xs sm:text-sm">{link.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 4 - Social Media */}
          <div className="text-center md:text-left">
            <h3 className="text-sm sm:text-base font-semibold mb-4 md:mb-6 text-a-yellow-100">Follow Us</h3>
            <div className="flex items-center gap-2 md:gap-3 justify-center md:justify-start">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-9 h-9 md:w-10 md:h-10 bg-a-yellow-100 rounded-full flex items-center justify-center text-a-green-600 hover:opacity-80 transition-opacity duration-300 flex-shrink-0"
                  aria-label={social.label}
                >
                  <social.icon size={16} className="md:w-[18px] md:h-[18px]" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Section - Large Brand Text */}
        <div className="py-6 md:py-8 lg:py-12 text-center overflow-hidden">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[70px] xl:text-[100px] 2xl:text-[140px] font-bold text-a-yellow-100 tracking-tight break-words px-2"
            style={{ fontFamily: 'serif' }}
          >
            AIHLAA  MAHASHI
          </h1>
        </div>

        {/* Bottom Section - Copyright & Licenses */}
        <div className="border-t border-a-green-600/30 py-4 md:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 text-xs sm:text-sm text-a-yellow-100 text-center md:text-left">
            <div className="wrap-break-word">
              {year} © AIHLAA MAHASHI
            </div>
            <Link href="/licenses" className="hover:opacity-80 transition-opacity duration-300">
              Licenses
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}