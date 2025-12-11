import Image from "next/image";

export function VerticalPromoCard() {
  return (
    <div className="hidden lg:block w-80 flex-shrink-0">
      <div className="relative rounded-2xl overflow-hidden h-[450px] shadow-2xl">
        <Image
          src="https://i.ibb.co.com/WWn5nTqX/25654835-food-instagram-story-19.jpg"
          alt="Promotional Banner"
          fill
          className="object-cover"
          sizes="320px"
          priority
        />
      </div>
    </div>
  );
}
