'use client';
import React from 'react';
import ShopOpenForm from '@/app/(admin)/admin/settings/_components/ShopOpenForm';
import RestaurantForms from '@/app/(admin)/admin/settings/_components/RestaurantForms';

const SettingsForm: React.FC = () => {
    const handleChanged = () => {
        // Optional: Handle any side effects when settings are updated
    };

    return (
        <div className="space-y-6">
            {/* Shop Open/Close Toggle */}
            <ShopOpenForm onChanged={handleChanged} />

            {/* Restaurant Information Forms */}
            <RestaurantForms onChanged={handleChanged} />
        </div>
    );
};

export default SettingsForm;
