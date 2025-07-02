import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import serviceCenters from "../../../../public/data/warehouses.json"; // adjust path as needed
import moment from "moment";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const BeARider = () => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [districts, setDistricts] = useState([]);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const allRegions = [...new Set(serviceCenters.map((item) => item.region))];
    setRegions(allRegions);
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      const filteredDistricts = serviceCenters
        .filter((item) => item.region === selectedRegion)
        .map((item) => item.district);
      setDistricts(filteredDistricts);
    } else {
      setDistricts([]);
    }
  }, [selectedRegion]);

  const onSubmit = (data) => {
    const applicationData = {
      ...data,
      name: user.displayName,
      email: user.email,
      status: "pending",
      appliedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    };
    // send rider to database

    axiosSecure.post("/riders", applicationData).then((res) => {
      if (res.data.insertedId) {
        toast.success("Application submitted successfully!");
      }
    });
    console.log(applicationData);

    // reset();
  };

  return (
    <div className="max-w-3xl mx-auto  p-6 rounded-xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Be A Rider</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="label">Name</label>
          <input
            type="text"
            value={user.displayName}
            readOnly
            className="input input-bordered w-full"
          />
        </div>

        {/* Email */}
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            value={user.email}
            readOnly
            className="input input-bordered w-full"
          />
        </div>

        {/* Age */}
        <div>
          <label className="label">Age</label>
          <input
            type="number"
            {...register("age", { required: true, min: 18 })}
            placeholder="Enter your age"
            className="input input-bordered w-full"
          />
          {errors.age && (
            <p className="text-red-500 text-sm">Age is required (18+)</p>
          )}
        </div>

        {/* Region */}
        <div>
          <label className="label">Region</label>
          <select
            {...register("region", { required: true })}
            className="select select-bordered w-full"
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="">Select Region</option>
            {regions.map((region, index) => (
              <option key={index} value={region}>
                {region}
              </option>
            ))}
          </select>
          {errors.region && (
            <p className="text-red-500 text-sm">Region is required</p>
          )}
        </div>

        {/* District */}
        <div>
          <label className="label">District</label>
          <select
            {...register("district", { required: true })}
            className="select select-bordered w-full"
          >
            <option value="">Select District</option>
            {districts.map((district, index) => (
              <option key={index} value={district}>
                {district}
              </option>
            ))}
          </select>
          {errors.district && (
            <p className="text-red-500 text-sm">District is required</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="label">Phone Number</label>
          <input
            type="tel"
            {...register("phone", { required: true })}
            placeholder="01XXXXXXXXX"
            className="input input-bordered w-full"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">Phone is required</p>
          )}
        </div>

        {/* NID Number */}
        <div>
          <label className="label">National ID Number</label>
          <input
            type="text"
            {...register("nid", { required: true })}
            placeholder="Enter NID Number"
            className="input input-bordered w-full"
          />
          {errors.nid && (
            <p className="text-red-500 text-sm">NID is required</p>
          )}
        </div>

        {/* Bike Brand */}
        <div>
          <label className="label">Bike Brand</label>
          <input
            type="text"
            {...register("bikeBrand", { required: true })}
            placeholder="e.g., Honda, Yamaha"
            className="input input-bordered w-full"
          />
          {errors.bikeBrand && (
            <p className="text-red-500 text-sm">Bike brand is required</p>
          )}
        </div>

        {/* Bike Registration Number */}
        <div>
          <label className="label">Bike Registration Number</label>
          <input
            type="text"
            {...register("bikeRegNumber", { required: true })}
            placeholder="Enter Registration Number"
            className="input input-bordered w-full"
          />
          {errors.bikeRegNumber && (
            <p className="text-red-500 text-sm">Bike reg. number is required</p>
          )}
        </div>

        {/* Submit */}
        <div className="text-center mt-6">
          <button type="submit" className="btn btn-primary text-black">
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
};

export default BeARider;
