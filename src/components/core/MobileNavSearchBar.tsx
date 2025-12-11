"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface MobileNavSearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNavSearchBar({ isOpen, onClose }: MobileNavSearchBarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Clear search query when component closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onClose();
      router.push(`/menu?search_param=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="lg:hidden mt-4"
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-a-yellow-100/70" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-12 py-3 rounded-full outline-none transition-all bg-a-yellow-100/20 border border-a-yellow-100/30 text-a-yellow-100 placeholder:text-a-yellow-100/60 focus:bg-a-yellow-100/30 focus:border-a-yellow-100 focus:ring-4 focus:ring-a-yellow-100/20"
              autoFocus
            />
            <motion.button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-a-yellow-100/30 rounded-full transition-colors"
              onClick={handleClose}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-4 h-4 text-a-yellow-100" />
            </motion.button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

