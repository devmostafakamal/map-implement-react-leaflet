import React from "react";
import Banner from "../Banner/Banner";
import ServiceCards from "../services/ServiceCards";
import ClientLogoSlider from "../slider/ClientLogoSlider";
import FeaturesSection from "../Feature/FeaturesSection";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Merchant from "../Merchant/Merchant";

function Home() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);
  return (
    <div>
      <Banner></Banner>
      <ServiceCards></ServiceCards>
      <ClientLogoSlider></ClientLogoSlider>
      <FeaturesSection></FeaturesSection>
      <Merchant></Merchant>
    </div>
  );
}

export default Home;
