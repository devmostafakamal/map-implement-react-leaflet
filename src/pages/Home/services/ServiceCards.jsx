import {
  FaTruck,
  FaGlobe,
  FaWarehouse,
  FaMoneyBillAlt,
  FaBuilding,
  FaUndo,
} from "react-icons/fa";

const services = [
  {
    icon: <FaTruck className="text-4xl text-indigo-600" />,
    title: "Express & Standard Delivery",
    description:
      "We deliver parcels within 24–72 hours in Dhaka, Chittagong, Sylhet, Khulna, and Rajshahi. Express delivery available in Dhaka within 4–6 hours from pick-up to drop-off.",
  },
  {
    icon: <FaGlobe className="text-4xl text-indigo-600" />,
    title: "Nationwide Delivery",
    description:
      "We deliver parcels nationwide with home delivery in every district, ensuring your products reach customers within 48–72 hours.",
  },
  {
    icon: <FaWarehouse className="text-4xl text-indigo-600" />,
    title: "Fulfillment Solution",
    description:
      "We also offer customized service with inventory management support, online order processing, packaging, and after sales support.",
  },
  {
    icon: <FaMoneyBillAlt className="text-4xl text-indigo-600" />,
    title: "Cash on Home Delivery",
    description:
      "100% cash on delivery anywhere in Bangladesh with guaranteed safety of your product.",
  },
  {
    icon: <FaBuilding className="text-4xl text-indigo-600" />,
    title: "Corporate Service / Contract In Logistics",
    description:
      "Customized corporate services which includes warehouse and inventory management support.",
  },
  {
    icon: <FaUndo className="text-4xl text-indigo-600" />,
    title: "Parcel Return",
    description:
      "Through our reverse logistics facility we allow end customers to return or exchange their products with online business merchants.",
  },
];

const ServiceCards = () => {
  return (
    <div className="mt-8 bg-[#03373D] py-24 px-24">
      <h2 className="text-center font-bold text-2xl text-white mb-4">
        Our Services
      </h2>
      <p className="text-center text-gray-500 mt-4">
        Enjoy fast, reliable parcel delivery with real-time tracking and zero
        hassle. From personal packages to <br /> business shipments — we deliver
        on time, every time.
      </p>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6 p-6 max-w-7xl mx-auto ">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition hover:bg-[#CAEB66] text-center"
          >
            <div className="mb-4 flex items-center justify-center">
              {service.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
            <p className="text-gray-600 text-sm">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceCards;
