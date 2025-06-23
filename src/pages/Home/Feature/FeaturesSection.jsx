const FeaturesSection = () => {
  const features = [
    {
      title: "Live Parcel Tracking",
      description:
        "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment’s journey and get instant status updates for complete peace of mind.",
      image: "/assets/ai-generated.jpg",
      // replace with actual path
      animation: "fade-right",
    },
    {
      title: "100% Safe Delivery",
      description:
        "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
      image: "/assets/safe-delivary.jpg", // replace with actual path
      animation: "fade-up",
    },
    {
      title: "24/7 Call Center Support",
      description:
        "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
      image: "/assets/call-center.jpg", // replace with actual path
      animation: "fade-left",
    },
  ];

  return (
    <section className="bg-gray-100 py-12 px-4 md:px-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {features.map((feature, index) => (
          <div
            key={index}
            data-aos={feature.animation}
            className={`flex flex-col md:flex-row items-center bg-white shadow-sm rounded-xl p-6 gap-6 ${
              index === 0 ? "border-l-4 border-pink-500" : ""
            }`}
          >
            <img
              src={feature.image}
              alt={feature.title}
              className="w-32 h-32 object-contain"
            />
            <div className="text-center md:text-left">
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
