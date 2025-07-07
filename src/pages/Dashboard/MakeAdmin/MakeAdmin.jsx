import React, { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";

function MakeAdmin() {
  const axiosSecure = useAxiosSecure();
  const [searchEmail, setSearchEmail] = useState("");
  const [triggerSearch, setTriggerSearch] = useState("");

  // 👉 Fetch all users initially
  const {
    data: allUsers = [],
    refetch: refetchAll,
    isLoading: loadingAll,
  } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  // 👉 Fetch search result only when email is triggered
  const {
    data: searchedUsers = [],
    refetch: refetchSearch,
    isFetching: searching,
  } = useQuery({
    queryKey: ["searchUsers", triggerSearch],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/search?email=${triggerSearch}`);
      return res.data;
    },
    enabled: !!triggerSearch,
  });

  const handleSearch = () => {
    if (!searchEmail.trim()) {
      Swal.fire("Error", "Please enter an email to search", "error");
      return;
    }
    setTriggerSearch(searchEmail.trim());
  };

  const handleMakeAdmin = async (email) => {
    const confirm = await Swal.fire({
      title: "Make Admin?",
      text: `Are you sure you want to make ${email} an admin?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, make admin",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.patch(`/users/make-admin/${email}`);
        Swal.fire("Success", "User promoted to admin", "success");
        if (triggerSearch) {
          refetchSearch(); // ✅ only refetch if query is enabled
        }
        refetchAll();
      } catch (error) {
        Swal.fire("Error", "Failed to promote user", "error");
      }
    }
  };

  const handleRemoveAdmin = async (email) => {
    const confirm = await Swal.fire({
      title: "Remove Admin?",
      text: `Are you sure you want to remove admin role from ${email}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.patch(`/users/remove-admin/${email}`);
        Swal.fire("Success", "Admin role removed", "success");
        if (triggerSearch) {
          refetchSearch(); // ✅ only refetch if query is enabled
        }
        refetchAll();
      } catch (error) {
        Swal.fire("Error", "Failed to remove admin role", "error");
      }
    }
  };

  const usersToShow = triggerSearch ? searchedUsers : allUsers;

  return (
    <div className="w-full mx-auto mt-10 p-4 shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">
        🔍 Make Admin Panel
      </h2>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Search by email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="input input-bordered w-full"
        />
        <button onClick={handleSearch} className="btn btn-primary">
          {searching ? "Searching..." : "Search"}
        </button>
      </div>

      {loadingAll && !triggerSearch ? (
        <p className="text-center text-gray-500">Loading users...</p>
      ) : usersToShow.length === 0 ? (
        <p className="text-center text-gray-500">No users found</p>
      ) : (
        usersToShow.map((user) => (
          <div
            key={user._id}
            className="border rounded-lg p-4 mb-3 flex items-center justify-between"
          >
            <div>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Role:</strong> {user.role || "user"}
              </p>
              <p>
                <strong>Joined:</strong>{" "}
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              {user.role === "admin" ? (
                <button
                  onClick={() => handleRemoveAdmin(user.email)}
                  className="btn btn-sm btn-warning"
                >
                  Remove Admin
                </button>
              ) : (
                <button
                  onClick={() => handleMakeAdmin(user.email)}
                  className="btn btn-sm btn-success"
                >
                  Make Admin
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MakeAdmin;
