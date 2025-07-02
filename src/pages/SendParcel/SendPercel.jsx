import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import moment from "moment"; // for creation_date
// import axios from "axios"; // If you're using it to send data to DB
import { v4 as uuidv4 } from "uuid";
import serviceCenters from "../../../public/data/warehouses.json";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const SendParcel = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const [deliveryCost, setDeliveryCost] = useState(null);
  const [pendingData, setPendingData] = useState(null);
  const [regions, setRegions] = useState([]);
  const [senderCenters, setSenderCenters] = useState([]);
  const [receiverCenters, setReceiverCenters] = useState([]);
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const parcelType = watch("type");
  const senderRegion = watch("senderRegion");
  const receiverRegion = watch("receiverRegion");

  function calculateDeliveryCost(data) {
    const {
      type,
      weight = 0,
      senderServiceCenter,
      receiverServiceCenter,
    } = data;
    const sameCenter = senderServiceCenter === receiverServiceCenter;
    const withinCity = sameCenter;

    const weightNum = parseFloat(weight) || 0;

    if (type === "document") {
      return withinCity ? 60 : 80;
    }

    if (type === "non-document") {
      if (weightNum <= 3) {
        return withinCity ? 110 : 150;
      } else {
        const extraWeight = weightNum - 3;
        const base = withinCity ? 110 : 150;
        const extraCost = extraWeight * 40;
        const outsideExtra = withinCity ? 0 : 40; // additional ৳40 if outside
        return base + extraCost + outsideExtra;
      }
    }

    return 0;
  }
  // first find unique region
  useEffect(() => {
    const uniqueRegions = [
      ...new Set(serviceCenters.map((item) => item.region)),
    ];
    setRegions(uniqueRegions);
  }, []);

  // Filter sender centers based on selected region
  useEffect(() => {
    if (senderRegion) {
      const filtered = serviceCenters.filter(
        (item) => item.region === senderRegion
      );
      setSenderCenters(filtered);
      setValue("senderServiceCenter", ""); // reset dependent select
    }
  }, [senderRegion, setValue]);

  // Filter receiver centers based on selected region
  useEffect(() => {
    if (receiverRegion) {
      const filtered = serviceCenters.filter(
        (item) => item.region === receiverRegion
      );
      setReceiverCenters(filtered);
      setValue("receiverServiceCenter", ""); // reset dependent select
    }
  }, [receiverRegion, setValue]);

  const onSubmit = (data) => {
    const cost = calculateDeliveryCost(data);
    const createdAt = new Date().toISOString(); // use for backend + frontend
    const trackingId = uuidv4().slice(0, 8).toUpperCase(); // short tracking code

    const parcelData = {
      ...data,
      deliveryCost: cost,
      createdBy: user?.email || "unknown",
      senderEmail: data.senderEmail || user?.email,
      createdAt,
      trackingId,
      status: "pending",
      paid: false,
      transactionId: null,
    };

    setDeliveryCost(cost);
    setPendingData(parcelData); // update full object

    const breakdown = {
      base: 50,
      weightCharge: 20,
      distanceCharge: 30,
    };

    toast.success(
      <div>
        <p className="font-semibold">Estimated Delivery Cost: ৳{cost}</p>
        <p className="text-sm text-gray-700">
          📦 <strong>Tracking ID:</strong> {trackingId}
        </p>
        <ul className="text-sm mt-1 text-gray-600">
          <li>📦 Base Cost: ৳{breakdown.base}</li>
          <li>⚖️ Weight Charge: ৳{breakdown.weightCharge}</li>
          <li>📍 Distance Charge: ৳{breakdown.distanceCharge}</li>
        </ul>
        <button
          onClick={() => handleEdit(parcelData)}
          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Edit Info
        </button>
      </div>,
      {
        autoClose: 3000, // ✅ use autoClose, not duration
      }
    );
    //send parcel data using axios
    {
      axiosSecure
        .post("/parcels", parcelData)
        .then((res) => {
          console.log(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleConfirm = () => {
    if (!pendingData) return;

    const finalData = {
      ...pendingData,
      confirmedAt: moment().format("YYYY-MM-DD HH:mm:ss"), // optional additional timestamp
    };

    // 👉 Here you would send `finalData` to your backend/database
    console.log("Saving Parcel:", finalData);

    toast.success("✅ Parcel information submitted successfully!");
    // reset(); // reset the form
    setDeliveryCost(null);
    setPendingData(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6  shadow rounded">
      <h2 className="text-2xl font-bold mb-2">Door to Door Parcel Delivery</h2>
      <p className="mb-6 text-gray-600">
        Please fill in all the required fields to schedule your parcel.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* --- Parcel Info --- */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Parcel Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label>Type</label>
              <select
                {...register("type", { required: true })}
                className="input input-bordered w-full"
              >
                <option value="">Select Type</option>
                <option value="document">Document</option>
                <option value="non-document">Non-document</option>
              </select>
              {errors.type && <p className="text-red-500">Type is required</p>}
            </div>
            <div>
              <label>Title</label>
              <input
                {...register("title", { required: true })}
                className="input input-bordered w-full"
              />
              {errors.title && (
                <p className="text-red-500">Title is required</p>
              )}
            </div>
            {parcelType === "non-document" && (
              <div>
                <label>Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  {...register("weight")}
                  className="input input-bordered w-full"
                />
              </div>
            )}
          </div>
        </div>

        {/* --- Sender Info --- */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Sender Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Name</label>
              <input
                defaultValue="Current User" // replace with logged-in user's name
                {...register("senderName", { required: true })}
                className="input input-bordered w-full"
              />
              {errors.senderName && (
                <p className="text-red-500">Sender name is required</p>
              )}
            </div>
            <div>
              <label>Contact</label>
              <input
                type="tel"
                {...register("senderContact", { required: true })}
                className="input input-bordered w-full"
              />
              {errors.senderContact && (
                <p className="text-red-500">Sender contact is required</p>
              )}
            </div>

            {/* Sender Region Dropdown */}
            <div>
              <label className="block font-medium">Sender Region</label>
              <select
                {...register("senderRegion", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="">Select Region</option>
                {regions.map((region, i) => (
                  <option key={i} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              {errors.senderRegion && (
                <p className="text-red-500 text-sm">
                  Sender region is required
                </p>
              )}
            </div>
            {/* Sender Service Center Dropdown */}
            <div>
              <label className="block font-medium">Sender Service Center</label>
              <select
                {...register("senderServiceCenter", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="">Select Service Center</option>
                {senderCenters.map((center, i) => (
                  <option key={i} value={center.city}>
                    {center.city}
                  </option>
                ))}
              </select>
              {errors.senderServiceCenter && (
                <p className="text-red-500 text-sm">
                  Sender service center is required
                </p>
              )}
            </div>
            <div>
              <label>Address</label>
              <textarea
                {...register("senderAddress", { required: true })}
                className="textarea textarea-bordered w-full"
              />
              {errors.senderAddress && (
                <p className="text-red-500">Sender address is required</p>
              )}
            </div>
            <div>
              <label>Pickup Instruction</label>
              <textarea
                {...register("pickupInstruction", { required: true })}
                className="textarea textarea-bordered w-full"
              />
              {errors.pickupInstruction && (
                <p className="text-red-500">Pickup instruction is required</p>
              )}
            </div>
          </div>
        </div>

        {/* --- Receiver Info --- */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Receiver Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Name</label>
              <input
                {...register("receiverName", { required: true })}
                className="input input-bordered w-full"
              />
              {errors.receiverName && (
                <p className="text-red-500">Receiver name is required</p>
              )}
            </div>
            <div>
              <label>Contact</label>
              <input
                type="tel"
                {...register("receiverContact", { required: true })}
                className="input input-bordered w-full"
              />
              {errors.receiverContact && (
                <p className="text-red-500">Receiver contact is required</p>
              )}
            </div>
            {/* Receiver Region Dropdown */}
            <div>
              <label className="block font-medium">Receiver Region</label>
              <select
                {...register("receiverRegion", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="">Select Region</option>
                {regions.map((region, i) => (
                  <option key={i} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              {errors.receiverRegion && (
                <p className="text-red-500 text-sm">
                  Receiver region is required
                </p>
              )}
            </div>
            {/* Receiver Service Center Dropdown */}
            <div>
              <label className="block font-medium">
                Receiver Service Center
              </label>
              <select
                {...register("receiverServiceCenter", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="">Select Service Center</option>
                {receiverCenters.map((center, i) => (
                  <option key={i} value={center.city}>
                    {center.city}
                  </option>
                ))}
              </select>
              {errors.receiverServiceCenter && (
                <p className="text-red-500 text-sm">
                  Receiver service center is required
                </p>
              )}
            </div>
            <div>
              <label>Address</label>
              <textarea
                {...register("receiverAddress", { required: true })}
                className="textarea textarea-bordered w-full"
              />
              {errors.receiverAddress && (
                <p className="text-red-500">Receiver address is required</p>
              )}
            </div>
            <div>
              <label>Delivery Instruction</label>
              <textarea
                {...register("deliveryInstruction", { required: true })}
                className="textarea textarea-bordered w-full"
              />
              {errors.deliveryInstruction && (
                <p className="text-red-500">Delivery instruction is required</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center ">
          <button type="submit" className="btn btn-primary text-black">
            Calculate & Submit
          </button>
        </div>
      </form>

      {/* Confirm Button after cost shown */}
      {deliveryCost !== null && (
        <div className="text-center mt-4">
          <p className="font-semibold text-green-600">
            Delivery Cost: ৳{deliveryCost} — Please confirm to submit.
          </p>
          <button onClick={handleConfirm} className="btn btn-success mt-2">
            Confirm
          </button>
        </div>
      )}
    </div>
  );
};

export default SendParcel;
