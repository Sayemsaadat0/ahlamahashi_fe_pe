"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function NavbarSearch() {
    const router = useRouter();
    const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setIsSearchDialogOpen(false);
            router.push(`/menu?search_param=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
        }
    };

    return (
        <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
            <DialogTrigger asChild>
                <motion.button
                    className="hidden lg:flex p-2.5 hover:bg-a-yellow-100/20 rounded-xl transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Search className="w-5 h-5 text-a-yellow-100" />
                </motion.button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg bg-a-green-600 text-a-yellow-100 border-none">
                <DialogHeader>
                    <DialogTitle>Search Products</DialogTitle>
                    <DialogDescription>
                        Enter your search query to find products.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSearchSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full"
                            autoFocus
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-a-yellow-100 hover:bg-a-yellow-100/90 text-a-green-600"
                        disabled={!searchQuery.trim()}
                    >
                        Search
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
