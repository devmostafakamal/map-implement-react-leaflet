import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

// Array of logo image URLs
const logos = [
  "/assets/brands/amazon_vector.png",
  "/assets/brands/amazon.png",
  "/assets/brands/casio.png",
  "/assets/brands/moonstar.png",
  "/assets/brands/randstad.png",
  "/assets/brands/start-people 1.png",
  "/assets/brands/start.png",
];

const ClientLogoSlider = () => {
  return (
    <>
      <div className=" bg-green-300 py-10">
        <h2 className="font-bold text-2xl text-center mb-2 ">
          We've helped thousands of sales teams
        </h2>
        <div className="py-10">
          <Swiper
            modules={[Autoplay]}
            slidesPerView={4}
            spaceBetween={0}
            loop={true}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
            }}
            speed={3000}
            grabCursor={true}
            className="client-swiper"
          >
            {logos.map((logo, index) => (
              <SwiperSlide
                key={index}
                className="flex items-center justify-center "
              >
                <img
                  src={logo}
                  alt={`Client ${index + 1}`}
                  className="h-6 w-auto object-contain !mx-0"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default ClientLogoSlider;
