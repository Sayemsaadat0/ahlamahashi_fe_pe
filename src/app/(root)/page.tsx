"use client"
import HomeContainer from "@/components/pages/home-page/HomeContainer"
import { useGuestStore } from "@/store/GuestStore";

const HomePage = () => {
  const { guestId } = useGuestStore();
  console.log(guestId);
  return (
    <div>
      <HomeContainer />
    </div>
  )
}
export default HomePage