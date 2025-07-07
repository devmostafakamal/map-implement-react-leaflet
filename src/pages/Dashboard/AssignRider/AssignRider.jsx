import React, { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

function AssignRider() {
  const axiosSecure = useAxiosSecure();
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [riders, setRiders] = useState([]);
  const queryClient = useQueryClient();

  // Load assignable parcels
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["assignableParcels"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/assignable");
      return res.data;
    },
  });

  // Open modal and load riders by region
  const handleAssignClick = async (parcel) => {
    setSelectedParcel(parcel);
    const region = parcel.receiverRegion || "unknown";

    try {
      const res = await axiosSecure.get(`/riders/by-region?region=${region}`);
      const filteredRiders = res.data.filter((rider) => rider.role === "rider");
      setRiders(filteredRiders);
      document.getElementById("assign_modal").showModal();
    } catch (error) {
      console.error("Failed to load riders:", error);
      Swal.fire("Error", "Failed to load riders for this region.", "error");
    }
  };

  // Assign rider to parcel
  const handleConfirmAssign = async (riderEmail) => {
    try {
      const res = await axiosSecure.patch(
        `/parcels/assign-rider/${selectedParcel._id}`,
        {
          assignedRider: riderEmail,
          delivery_status: "assigned",
        }
      );

      if (res.data.parcelModified > 0) {
        Swal.fire("Success", "Rider assigned successfully!", "success");
        document.getElementById("assign_modal").close();
        setRiders([]);
        setSelectedParcel(null);
        queryClient.invalidateQueries(["assignableParcels"]); // refresh list
      } else {
        Swal.fire("Failed", "No changes made.", "warning");
      }
    } catch (error) {
      console.error("Assignment failed:", error);
      Swal.fire("Error", "Something went wrong during assignment.", "error");
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Assign Rider</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Tracking ID</th>
              <th>Receiver</th>
              <th>Cost</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel, index) => (
              <tr key={parcel._id}>
                <td>{index + 1}</td>
                <td>{parcel.trackingId}</td>
                <td>{parcel.receiverName}</td>
                <td>৳ {parcel.deliveryCost}</td>
                <td>{parcel.delivery_status || "N/A"}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleAssignClick(parcel)}
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Assign Modal */}
      <dialog id="assign_modal" className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-lg mb-4">
            Assign Rider to: {selectedParcel?.trackingId}
          </h3>

          {riders.length === 0 ? (
            <p className="text-gray-500">
              No available riders in this district.
            </p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {riders.map((rider) => (
                <div
                  key={rider._id}
                  className="flex items-center justify-between border p-2 rounded"
                >
                  <div>
                    <p className="font-semibold">{rider.name}</p>
                    <p className="text-sm text-gray-500">{rider.email}</p>
                  </div>
                  <button
                    onClick={() => handleConfirmAssign(rider.email)}
                    className="btn btn-sm btn-success"
                  >
                    Assign
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default AssignRider;
