import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

export default function PendingDeliveries() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const {
    data: parcels = [],
    isLoading,
    isError,
    error,
    refetch, // ✅ added this
  } = useQuery({
    queryKey: ["riderPendingDeliveries", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/rider/parcels?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // ✅ Status update function with SweetAlert + refetch
  const handleStatusUpdate = async (parcelId, newStatus) => {
    try {
      const confirm = await Swal.fire({
        title: "Are you sure?",
        text: `Mark this parcel as "${newStatus.replace("-", " ")}"?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update it!",
      });

      if (confirm.isConfirmed) {
        const res = await axiosSecure.patch(
          `/parcels/update-status/${parcelId}`,
          { delivery_status: newStatus }
        );

        if (res.data.modifiedCount > 0) {
          Swal.fire("Success!", "Status updated.", "success");
          refetch(); // 🔁 refresh the table
        } else {
          Swal.fire("Error", "Status not updated.", "error");
        }
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  // ✅ Loading and Error handling
  if (isLoading) return <div>Loading...</div>;

  if (isError) {
    Swal.fire("Error", "Failed to load pending deliveries.", "error");
    return <div className="text-red-500">Error loading data</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Pending Deliveries</h2>
      {parcels.length === 0 ? (
        <p>No assigned or in-transit deliveries yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200">
                <th>#</th>
                <th>Tracking ID</th>
                <th>Receiver</th>
                <th>Service Area</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel, index) => (
                <tr key={parcel._id}>
                  <td>{index + 1}</td>
                  <td>{parcel.trackingId}</td>
                  <td>
                    {parcel.receiverName}
                    <br />
                    <span className="text-sm text-gray-500">
                      {parcel.receiverContact}
                    </span>
                  </td>
                  <td>
                    {parcel.receiverRegion}, {parcel.receiverServiceCenter}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        parcel.delivery_status === "assigned"
                          ? "badge-warning"
                          : parcel.delivery_status === "in-transit"
                          ? "badge-info"
                          : "badge-ghost"
                      }`}
                    >
                      {parcel.delivery_status}
                    </span>
                  </td>
                  <td>
                    {parcel.delivery_status === "assigned" ? (
                      <button
                        onClick={() =>
                          handleStatusUpdate(parcel._id, "in-transit")
                        }
                        className="btn btn-warning text-black"
                      >
                        Mark Picked Up
                      </button>
                    ) : parcel.delivery_status === "in-transit" ? (
                      <button
                        onClick={() =>
                          handleStatusUpdate(parcel._id, "delivered")
                        }
                        className="btn btn-success text-black"
                      >
                        Mark Delivered
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
