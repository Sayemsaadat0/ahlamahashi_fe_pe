"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Utensils, Search as SearchIcon } from "lucide-react";
import MenuListItemCard from "@/components/ui/MenuListItemCard";
import { useGetCategorisedMenu } from "@/hooks/menu.hooks";

function MenuPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  // Initialize search query from URL param
  const initialSearchQuery = searchParams.get("search_param") || "";
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>(initialSearchQuery);

  // Update search query when URL param changes (e.g., from navigation)
  useEffect(() => {
    const urlSearchParam = searchParams.get("search_param") || "";
    setSearchQuery(urlSearchParam);
    setDebouncedSearchQuery(urlSearchParam);
  }, [searchParams]);

  // Debounce search query and update URL
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      
      // Update URL search params
      const params = new URLSearchParams(searchParams.toString());
      if (searchQuery.trim()) {
        params.set("search_param", searchQuery.trim());
      } else {
        params.delete("search_param");
      }
      
      // Update URL without page reload
      const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.replace(newUrl, { scroll: false });
    }, 500); // 500ms delay

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery, pathname, router, searchParams]);

  const { data: categorisedMenuData, isLoading } = useGetCategorisedMenu(1, debouncedSearchQuery);
  const categories = categorisedMenuData?.data?.categories || [];

  return (
    <main className="py-10 md:py-14">
      <div className="ah-container mx-auto">
        {/* Header */}
        <div className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Our Menu
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Fresh, curated, delicious.
            </p>
          </div>
          <div className="relative w-full md:max-w-md">
            <SearchIcon
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for items..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-a-green-600/50 focus:border-a-green-600 transition-all text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Menu Sections by Category */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="bg-gray-50 rounded-3xl p-12 max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <Utensils size={48} className="mx-auto animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading menu...</h3>
              <p className="text-gray-500">Please wait while we fetch the menu.</p>
            </div>
          </div>
        ) : categories.length > 0 ? (
          <div className="space-y-12 md:space-y-16">
            {categories.map((category) => (
              <CategorySection
                key={category.id}
                categoryName={category.categoryName}
                description={category.description || ""}
                items={category.items}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-gray-50 rounded-3xl p-12 max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <Utensils size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No items found</h3>
              <p className="text-gray-500">We couldn&apos;t find any items in this category.</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={
      <main className="py-10 md:py-14">
        <div className="ah-container mx-auto">
          <div className="text-center py-20">
            <div className="bg-gray-50 rounded-3xl p-12 max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <Utensils size={48} className="mx-auto animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading...</h3>
            </div>
          </div>
        </div>
      </main>
    }>
      <MenuPageContent />
    </Suspense>
  );
}

type CategorySectionProps = {
  categoryName: string;
  description: string;
  items: Array<{
    id: number;
    name: string;
    prices: Array<{ id: number; price: number }>;
    thumbnail: string;
    description: string;
    isAvailable: boolean;
    isSpecial: boolean;
  }>;
};

function CategorySection({ categoryName, description, items }: CategorySectionProps) {
  return (
    <section>
      {/* Category Title - Minimal, Left Aligned */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
          {categoryName}
        </h2>
        {description && (
          <p className="text-gray-600 text-sm md:text-base">{description}</p>
        )}
      </div>

      {/* Grid Layout - 1 column mobile, 2 columns large */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {items.map((item) => (
          <MenuListItemCard
            key={item.id}
            item={item}
            categoryName={categoryName}
          />
        ))}
      </div>
    </section>
  );
}
