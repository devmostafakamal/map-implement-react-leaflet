import { useQuery, useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

export default function RiderCompletedDeliveries() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const {
    data: parcels = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["riderCompletedParcels", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/rider/completed-parcels?email=${user.email}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Filter only parcels not yet cashed out
  const unpaidParcels = parcels.filter((p) => !p.cashedOut);

  const calculateEarning = (parcel) => {
    const sameDistrict = parcel.senderRegion === parcel.receiverRegion;
    const rate = sameDistrict ? 0.8 : 0.3;
    return Math.round(parcel.deliveryCost * rate);
  };

  const totalAvailable = unpaidParcels.reduce(
    (acc, p) => acc + calculateEarning(p),
    0
  );

  const mutation = useMutation({
    mutationFn: async () => {
      const ids = unpaidParcels.map((p) => p._id);
      const res = await axiosSecure.post("/rider/cashout", { parcelIds: ids });
      return res.data;
    },
    onSuccess: (data) => {
      Swal.fire(
        "Cash Out Requested",
        "Your cash out has been submitted.",
        "success"
      );
      refetch();
    },
    onError: () => {
      Swal.fire("Error", "Cash out failed. Please try again later.", "error");
    },
  });

  const handleCashOut = async () => {
    if (totalAvailable === 0) return;

    const confirm = await Swal.fire({
      title: "Cash Out?",
      text: `You will request ৳${totalAvailable} cash out.`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Yes, Request",
    });

    if (confirm.isConfirmed) {
      mutation.mutate();
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Completed Deliveries</h2>

      <div className="mb-4 flex items-center justify-between">
        <p className="font-semibold">
          Available for Cash Out:{" "}
          <span className="text-green-600">৳ {totalAvailable}</span>
        </p>
        <button
          disabled={totalAvailable === 0 || mutation.isLoading}
          onClick={handleCashOut}
          className="btn btn-primary text-black"
        >
          {mutation.isLoading ? "Processing..." : "Cash Out"}
        </button>
      </div>

      {parcels.length === 0 ? (
        <p>No completed deliveries yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200">
                <th>#</th>
                <th>Tracking ID</th>
                <th>Receiver</th>
                <th>Region</th>
                <th>Picked</th>
                <th>Delivered</th>
                <th>Fee</th>
                <th>Earning</th>
                <th>Cash Out</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel, index) => {
                const earning = calculateEarning(parcel);
                return (
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
                      {parcel.pickedAt
                        ? new Date(parcel.pickedAt).toLocaleString()
                        : "N/A"}
                    </td>
                    <td>
                      {parcel.deliveredAt
                        ? new Date(parcel.deliveredAt).toLocaleString()
                        : "N/A"}
                    </td>
                    <td>৳ {parcel.deliveryCost}</td>
                    <td className="text-green-600 font-semibold">
                      ৳ {earning}
                    </td>
                    <td>
                      {parcel.cashedOut ? (
                        <span className="badge badge-success">Paid</span>
                      ) : (
                        <span className="badge badge-warning">Pending</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
