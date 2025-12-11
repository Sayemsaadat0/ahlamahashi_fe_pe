'use client'

import React, { useState } from "react";
import { useGetCategoriesList } from "@/hooks/category.hooks";
import { useGetMenuList } from "@/hooks/menu.hooks";
import { CategoryDisplay, MenuItemsDisplay } from "./MenuSectionComponents";

const MenuSection: React.FC = () => {
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);

    const { data: categoriesData } = useGetCategoriesList();
    const { data: menuData, isLoading: isMenuLoading } = useGetMenuList(selectedCategoryId, 1);

    const categories = categoriesData?.data?.categories || [];
    const allItems = menuData?.data?.items || [];
    console.log(typeof(menuData)    )

    // console.log('MenuSection - menuData:', menuData);
    // console.log('MenuSection - allItems:', allItems);
    // console.log('MenuSection - isArray:', Array.isArray(allItems));

    const handleCategoryChange = (categoryId: number | null) => {
        setSelectedCategoryId(categoryId === null ? undefined : categoryId);
    };

    return (
        <section className="bg-a-green-600 py-8 md:py-10 z-20 relative">
            <div className="ah-container mx-auto">
                {/* Title & Subtitle */}
                <div className="mb-6 md:mb-8 text-a-yellow-100">
                    <h2 className="text-xl sm:text-xl font-semibold mb-2">
                        Our Menu
                    </h2>
                </div>

                {/* Categories Section */}
                <div className="mb-8">
                    <CategoryDisplay
                        categories={categories}
                        activeTab={selectedCategoryId}
                        onTabChange={handleCategoryChange}
                    />
                </div>

                {/* Menu Items Section */}
                <div>
                    {isMenuLoading ? (
                        <div className="text-center py-20">
                            <div className="bg-white/10 rounded-3xl p-12 max-w-md mx-auto">
                                <div className="text-a-yellow-100 mb-4">
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
                                <h3 className="text-xl font-semibold text-a-yellow-100 mb-2">Loading menu items...</h3>
                                <p className="text-a-yellow-100/80">Please wait while we fetch the latest menu.</p>
                            </div>
                        </div>
                    ) : (
                        <MenuItemsDisplay items={allItems} />
                    )}
                </div>
            </div>
        </section>
    );
};

export default MenuSection;
