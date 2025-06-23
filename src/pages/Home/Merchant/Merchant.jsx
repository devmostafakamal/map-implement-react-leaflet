import React from "react";

function Merchant() {
  return (
    <div
      data-aos="zoom-in-up"
      className="bg-no-repeat bg-[#03373D] p-20 rounded-4xl bg-[url('assets/be-a-merchant-bg.png')]"
    >
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img
          src="/assets/location-merchant.png"
          className="max-w-sm rounded-lg shadow-2xl"
        />
        <div>
          <h1 className="text-5xl font-bold text-white">
            Merchant and Customer Satisfaction <br /> is Our First Priority
          </h1>
          <p className="py-6 text-gray-400">
            We offer the lowest delivery charge with the highest value along
            with 100% <br /> safety of your product. Pathao courier delivers
            your parcels in every <br /> corner of Bangladesh right on time.
          </p>
          <div className="flex gap-2">
            <button className="btn btn-primary text-black">
              Become a Marchant
            </button>
            <button className="btn btn-primary text-black">
              Earn with Profast Courier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Merchant;
