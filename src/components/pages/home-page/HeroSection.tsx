"use client";
import { useEffect } from "react";
import { useGuestStore } from "@/store/GuestStore";
// import Image from "next/image";
import { HeroBanner } from "./HeroBanner";
import { VerticalPromoCard } from "./VerticalPromoCard";
// import { toast } from "sonner";
import { useAuthStore } from "@/store/AuthStore";

const HeroSection = () => {
  const { guestId, generateGuestId, _hasHydrated } = useGuestStore();
  const { user,  } = useAuthStore();
console.log(user);
  // Set guest ID on mount if it doesn't exist
  useEffect(() => {
    if (_hasHydrated && !guestId) {
      generateGuestId();
    }
  }, [_hasHydrated, guestId, generateGuestId]);

  // const handleGenerateGuestId = () => {
  //   generateGuestId();
  //   toast.success("Guest ID generated successfully");
  // };
  return (
    <section className="bg-linear-to-br  h-full py-12 md:py-20 relative">
      {/* <div className="ah-container">
        <div className=" ">
          Hello {guestId} <br /> <br />
          <button
            className="bg-a-green-600 text-white px-4 py-2 rounded-md"
            onClick={handleGenerateGuestId}
          >
            Generate Guest ID
          </button>
        </div>
        <div>
            {user?.name || "No User"} <br /> <br />
            <button
            className="bg-a-green-600 text-white px-4 py-2 rounded-md"
            onClick={removeAuth}
          >
            Remove auth
          </button>
        </div>
      </div> */}
      <div className="ah-container relative z-10 mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <HeroBanner />
          </div>
          <VerticalPromoCard />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
