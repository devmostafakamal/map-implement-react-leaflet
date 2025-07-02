import React, { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

function ActiveRiders() {
  const [search, setSearch] = useState("");
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: riders = [], isLoading } = useQuery({
    queryKey: ["active-riders", search],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/riders?status=approved&name=${search}`
      );
      return res.data;
    },
  });

  const { mutate: deactivateRider } = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.patch(`/riders/deactivate/${id}`);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Deactivated!", "Rider status changed to inactive.", "success");
      queryClient.invalidateQueries(["active-riders"]);
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    queryClient.invalidateQueries(["active-riders"]);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Active Riders</h2>

      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          placeholder="Search by name"
          className="input input-bordered w-full max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn ml-2">Search</button>
      </form>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
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
                <th>Bike No</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {riders.map((rider, index) => (
                <tr key={rider._id}>
                  <td>{index + 1}</td>
                  <td>{rider.name}</td>
                  <td>{rider.email}</td>
                  <td>{rider.phone}</td>
                  <td>{rider.region}</td>
                  <td>{rider.district}</td>
                  <td>{rider.bikeRegNumber}</td>
                  <td>
                    <span className="badge badge-success">{rider.status}</span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => {
                        Swal.fire({
                          title: "Are you sure?",
                          text: "You want to deactivate this rider?",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#d33",
                          cancelButtonColor: "#3085d6",
                          confirmButtonText: "Yes, deactivate!",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            deactivateRider(rider._id);
                          }
                        });
                      }}
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {riders.length === 0 && (
            <p className="text-center mt-4">No active riders found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ActiveRiders;
