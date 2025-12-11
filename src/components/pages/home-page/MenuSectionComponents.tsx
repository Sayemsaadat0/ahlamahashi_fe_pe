'use client'

import React from 'react';
import { CategoryType } from '@/hooks/category.hooks';
import { MenuItem } from '@/hooks/menu.hooks';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import MenuCard from "@/components/ui/MenuCard";

// Category Display Component
interface CategoryDisplayProps {
  categories: CategoryType[];
  activeTab: number | undefined;
  onTabChange: (categoryId: number | null) => void;
}

export const CategoryDisplay: React.FC<CategoryDisplayProps> = ({
  categories,
  activeTab,
  onTabChange
}) => {
  const allCategories = [
    { id: null, name: "All", status: "published" },
    ...categories
  ];

  return (
    <div className="mb-4 md:mb-5">
      <div className="flex gap-2 sm:gap-3 py-2 overflow-auto md:overflow-visible md:justify-start md:gap-4 scrollbar-hide"
        style={{ WebkitOverflowScrolling: "touch" }}>
        {allCategories.map((category) => {
          const isActive = category.id === activeTab || (category.id === null && activeTab === undefined);
          return (
            <button
              key={category.id || 'all'}
              onClick={() => onTabChange(category.id ?? null)}
              className={`
                                flex flex-col items-start justify-center px-3 sm:px-4 py-2.5 sm:py-3 min-w-[100px] sm:min-w-[110px] rounded-xl sm:rounded-2xl 
                                transition duration-200 
                                ${isActive ? "bg-a-yellow-100 shadow" : "bg-white/20"}
                                group
                            `}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="flex flex-col items-start gap-0">
                <span className={`font-semibold text-sm mb-0.5 ${isActive ? "text-a-green-600" : "text-a-yellow-100"}`}>
                  {category.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Menu Items Display Component
interface MenuItemsDisplayProps {
  items: MenuItem[];
}

export const MenuItemsDisplay: React.FC<MenuItemsDisplayProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="bg-gray-50 rounded-3xl p-12 max-w-md mx-auto">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No items found</h3>
          <p className="text-gray-500">We couldn&apos;t find any items in this category.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Left fade shadow - only visible on large devices */}
      <div className="hidden md:block absolute left-0 top-0 bottom-14 w-12 z-10 pointer-events-none bg-linear-to-r from-a-green-600/60 to-transparent" />
      {/* Right fade shadow - only visible on large devices */}
      <div className="hidden md:block absolute right-0 top-0 bottom-14 w-12 z-10 pointer-events-none bg-linear-to-l from-a-green-600/60 to-transparent" />

      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3200, disableOnInteraction: false }}
        loop={items.length > 4}
        grabCursor
        centeredSlides={true}
        spaceBetween={16}
        slidesPerView={1.5}
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 18, centeredSlides: true },
          768: { slidesPerView: 2.5, spaceBetween: 20, centeredSlides: false },
          1024: { slidesPerView: 3.5, spaceBetween: 22, centeredSlides: false },
          1280: { slidesPerView: 4.5, spaceBetween: 24, centeredSlides: false },
        }}
        className="menu-section-swiper pb-14!"
      >
        {Array.isArray(items) && items.map((item, index) => (
          <SwiperSlide key={item.id} className="py-4">
            <MenuCard
              item={item}
              showQuickAdd={false}
              variant="glass"
              badgeLabel={
                index === 0
                  ? "Top Pick"
                  : item.category?.name || "Popular"
              }
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
                .menu-section-swiper .swiper-pagination-bullet {
                    background-color: rgba(186, 190, 162, 0.25);
                    opacity: 1;
                }
                .menu-section-swiper .swiper-pagination-bullet-active {
                    background-color: rgb(226, 230, 213);
                }
            `}</style>
    </div>
  );
};
