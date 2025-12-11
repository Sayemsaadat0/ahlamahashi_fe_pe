'use client'

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import MenuCard from "@/components/ui/MenuCard";
import { useGetMenuList } from "@/hooks/menu.hooks";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const WeeklyMenu: React.FC = () => {
    // Fetch special menu items (isSpecial === true)
    const { data: menuData, isLoading: isMenuLoading } = useGetMenuList(undefined, 1, true);
    const weeklyItems = menuData?.data?.items || [];
    console.log(weeklyItems);

    return (
        <section className=" py-8 md:py-12 z-20 relative">
            <div className="ah-container mx-auto relative z-10">
                {/* Title, Description & Button */}
                <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-lg sm:text-xl font-semibold mb-1.5 text-a-green-600">
                            Weekly Menu
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-600">
                            Discover our chef&apos;s special selections this week
                        </p>
                    </div>
                    <Link
                        href="/menu"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-a-green-600 text-white text-sm font-semibold hover:bg-a-green-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                    >
                        Explore More
                        <ArrowRight size={16} />
                    </Link>
                </div>

                {/* Menu Cards - Grid on Desktop, Slider on Mobile */}
                <div>
                    {isMenuLoading ? (
                        <div className="text-center py-20">
                            <div className="bg-gray-50 rounded-3xl p-12 max-w-md mx-auto">
                                <div className="text-gray-400 mb-4">
                                    <svg 
                                        className="mx-auto w-12 h-12 animate-spin" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <circle 
                                            className="opacity-25" 
                                            cx="12" 
                                            cy="12" 
                                            r="10" 
                                            stroke="currentColor" 
                                            strokeWidth="4"
                                        />
                                        <path 
                                            className="opacity-75" 
                                            fill="currentColor" 
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading weekly menu...</h3>
                                <p className="text-gray-500">Please wait while we fetch the special selections.</p>
                            </div>
                        </div>
                    ) : weeklyItems.length > 0 ? (
                        <>
                            {/* Mobile Slider */}
                            <div className="md:hidden">
                                <Swiper
                                    modules={[Autoplay, Pagination]}
                                    autoplay={{ delay: 3200, disableOnInteraction: false }}
                                    loop
                                    grabCursor
                                    centeredSlides
                                    spaceBetween={16}
                                    slidesPerView={1.2}
                                    pagination={{ clickable: true }}
                                    className="weekly-menu-swiper pb-14!"
                                >
                                    {weeklyItems.map((item, index) => (
                                        <SwiperSlide key={item.id} className="py-4">
                                            <MenuCard
                                                item={item}
                                                showQuickAdd={false}
                                                variant="default"
                                                badgeLabel={
                                                    index === 0
                                                        ? "Top Pick"
                                                        : item.category?.name || "Popular"
                                                }
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>

                            {/* Desktop Grid */}
                            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                                {weeklyItems.map((item, index) => (
                                    <MenuCard
                                        key={item.id}
                                        item={item}
                                        showQuickAdd={false}
                                        variant="default"
                                        badgeLabel={
                                            index === 0
                                                ? "Top Pick"
                                                : item.category?.name || "Popular"
                                        }
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-20">
                            <div className="bg-gray-50 rounded-3xl p-12 max-w-md mx-auto">
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No items found</h3>
                                <p className="text-gray-500">We couldn&apos;t find any items in this category.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <style jsx global>{`
                .weekly-menu-swiper .swiper-pagination-bullet {
                    background-color: rgba(186, 190, 162, 0.25);
                    opacity: 1;
                }
                .weekly-menu-swiper .swiper-pagination-bullet-active {
                    background-color: rgb(186, 190, 162);
                }
            `}</style>
            <div className="absolute bottom-0 right-">
                <Image
                    src="/foodIcon4.svg"
                    alt="Food Icon"
                    width={1900}
                    height={900}
                    className="object-cover "
                />
            </div>
        </section>
    );
};

export default WeeklyMenu;

