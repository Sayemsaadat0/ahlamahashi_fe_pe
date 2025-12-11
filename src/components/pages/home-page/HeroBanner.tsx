'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';

const bannerSlides = [
  {
    image: 'https://i.pinimg.com/736x/6e/30/96/6e309677966c27f25f8aa18b7ea43fd2.jpg',
    alt: 'Fresh Food Banner',
  },
  {
    image: 'https://i.ibb.co.com/mFYF0cNY/9641408.jpg',
    alt: 'Fresh Food Banner',
  },
];

export function HeroBanner() {
  return (
    <div className="h-[250px] sm:h-[300px] md:h-[350px] w-full max-w-full overflow-hidden rounded-2xl lg:h-[450px] relative">
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation={{
          nextEl: '.banner-swiper-button-next',
          prevEl: '.banner-swiper-button-prev',
        }}
        pagination={{
          el: '.banner-swiper-pagination',
          clickable: true,
          bulletClass: 'banner-pagination-bullet',
          bulletActiveClass: 'banner-pagination-bullet-active',
        }}
        modules={[Navigation, Pagination, Autoplay]}
        className="bannerSwiper w-full h-full"
      >
        {bannerSlides.map((slide) => (
          <SwiperSlide key={crypto.randomUUID()} className="w-full h-full">
            <div className="relative w-full h-full overflow-hidden rounded-2xl">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
                priority
              />
            </div>
          </SwiperSlide>
        ))}
        {/* Navigation Arrows */}
        <div className="absolute bottom-6 right-6 z-30 flex gap-2">
          <button
            className="banner-swiper-button-prev w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-lg hover:bg-a-green-600 hover:text-white  transition-colors"
            aria-label="Previous slide"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            className="banner-swiper-button-next w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-lg hover:bg-a-green-600  hover:text-white transition-colors"
            aria-label="Next slide"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </Swiper>
    </div>
  );
}

