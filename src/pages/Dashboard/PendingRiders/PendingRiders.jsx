import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const PendingRiders = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [selectedRider, setSelectedRider] = useState(null);

  // 1. Fetch all pending riders
  const {
    data: pendingRiders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["pendingRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders?status=pending");
      return res.data;
    },
  });

  // 2. Approve mutation
  const { mutate: approveRider } = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.patch(`/riders/pending/${id}`, {
        status: "approved",
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Rider approved");
      queryClient.invalidateQueries(["pendingRiders"]);
      setSelectedRider(null);
    },
  });

  // 3. Delete mutation
  const { mutate: deleteRider } = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/riders/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Rider deleted");
      queryClient.invalidateQueries(["pendingRiders"]);
      setSelectedRider(null);
    },
  });

  // 4. Handler functions
  const handleApprove = (id) => {
    Swal.fire({
      title: "Approve this rider?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, approve",
    }).then((result) => {
      if (result.isConfirmed) {
        approveRider(id);
      }
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This rider will be permanently removed!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteRider(id);
      }
    });
  };

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pending Riders</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Region</th>
              <th>District</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingRiders.map((rider, index) => (
              <tr key={rider._id}>
                <td>{index + 1}</td>
                <td>{rider.name}</td>
                <td>{rider.email}</td>
                <td>{rider.phone}</td>
                <td>{rider.region}</td>
                <td>{rider.district}</td>
                <td className="flex gap-2">
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => setSelectedRider(rider)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleApprove(rider._id)}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleDelete(rider._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {selectedRider && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-gray-400 p-6 rounded-xl w-full max-w-xl relative">
            <h3 className="text-xl font-bold mb-4">Rider Details</h3>
            <button
              onClick={() => setSelectedRider(null)}
              className="absolute top-2 right-2 text-lg"
            >
              ✖
            </button>
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {selectedRider.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedRider.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedRider.phone}
              </p>
              <p>
                <strong>Region:</strong> {selectedRider.region}
              </p>
              <p>
                <strong>District:</strong> {selectedRider.district}
              </p>
              <p>
                <strong>Age:</strong> {selectedRider.age}
              </p>
              <p>
                <strong>NID:</strong> {selectedRider.nid}
              </p>
              <p>
                <strong>Bike Brand:</strong> {selectedRider.bikeBrand}
              </p>
              <p>
                <strong>Bike Reg. No:</strong> {selectedRider.bikeRegNumber}
              </p>
              <p>
                <strong>Applied At:</strong> {selectedRider.appliedAt}
              </p>
            </div>
            <div className="mt-4 flex justify-end gap-4">
              <button
                className="btn btn-error"
                onClick={() => handleDelete(selectedRider._id)}
              >
                Delete
              </button>
              <button
                className="btn btn-success"
                onClick={() => handleApprove(selectedRider._id)}
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRiders;
