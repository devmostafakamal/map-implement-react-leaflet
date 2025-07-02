import React, { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

function MyParcels() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [selectedParcel, setSelectedParcel] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const {
    data: parcels = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-parcel", user?.email],
    enabled: !!user?.email, // ensures it waits for user to load
    queryFn: async () => {
      const token = await user.getIdToken(); // ✅ get token
      const res = await axiosSecure.get(`/myParcels?email=${user.email}`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ send token
        },
      });
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`/parcels/${id}`);
    },
    onSuccess: () => {
      toast.success("Parcel deleted!");
      queryClient.invalidateQueries(["my-parcel"]);
    },
  });

  const handleView = (parcel) => {
    setSelectedParcel(parcel);
    setShowViewModal(true);
  };

  const handleUpdate = (parcel) => {
    setSelectedParcel(parcel);
    setShowUpdateModal(true);
  };
  const handlePayment = (id) => {
    console.log(id);
    navigate(`/dashboard/payment/${id}`);
  };
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this parcel?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id, {
          onSuccess: () => {
            Swal.fire("Deleted!", "Your parcel has been deleted.", "success");
            refetch();
          },
          onError: () => {
            Swal.fire("Error!", "Failed to delete the parcel.", "error");
          },
        });
      }
    });
  };

  if (isLoading) return <p>Loading parcels...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">📦 My Parcels</h2>
      {parcels.length === 0 ? (
        <p>No parcels found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-base-300">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Sender</th>
                <th>Receiver</th>
                <th>Status</th>
                <th>Cost</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel, index) => (
                <tr key={parcel._id}>
                  <td>{index + 1}</td>
                  <td>{parcel.title}</td>
                  <td>{parcel.senderName}</td>
                  <td>{parcel.receiverName}</td>
                  <td>
                    <span
                      className={`badge ${
                        parcel.status === "pending"
                          ? "badge-warning"
                          : parcel.status === "delivered"
                          ? "badge-success"
                          : "badge-ghost"
                      }`}
                    >
                      {parcel.status}
                    </span>
                  </td>
                  <td>৳{parcel.deliveryCost}</td>
                  <td>{new Date(parcel.createdAt).toLocaleDateString()}</td>
                  <td className="space-x-1">
                    <button
                      onClick={() => handleView(parcel)}
                      className="btn btn-sm btn-info"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleUpdate(parcel)}
                      className="btn btn-sm btn-warning"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(parcel._id)}
                      className="btn btn-sm btn-error"
                    >
                      Delete
                    </button>
                    {!parcel.paid && (
                      <button
                        onClick={() => handlePayment(parcel._id)}
                        className="btn btn-sm btn-success"
                      >
                        Pay
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedParcel && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">📄 Parcel Details</h3>
            <p>
              <strong>Title:</strong> {selectedParcel.title}
            </p>
            <p>
              <strong>Sender:</strong> {selectedParcel.senderName}
            </p>
            <p>
              <strong>Receiver:</strong> {selectedParcel.receiverName}
            </p>
            <p>
              <strong>Status:</strong> {selectedParcel.status}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(selectedParcel.createdAt).toLocaleString()}
            </p>
            <div className="modal-action">
              <button className="btn" onClick={() => setShowViewModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal (just a placeholder for now) */}
      {showUpdateModal && selectedParcel && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">✏️ Update Parcel</h3>
            <p>You can build a form here to update the parcel data.</p>
            <div className="modal-action">
              <button className="btn" onClick={() => setShowUpdateModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyParcels;
