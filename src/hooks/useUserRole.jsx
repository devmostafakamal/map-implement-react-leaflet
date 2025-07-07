import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";
function useUserRole() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: role,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userRole", user?.email],
    queryFn: async () => {
      if (!user?.email) {
        throw new Error("Email not available");
      }

      try {
        const userRes = await axiosSecure.get(
          `/users/role?email=${user.email}`
        );
        const userRole = userRes.data?.role;

        if (userRole === "admin") return "admin"; // ✅ trust only admin
        // if role is just "user" or not set, keep checking rider
      } catch (err) {}

      try {
        const riderRes = await axiosSecure.get(
          `/riders/role?email=${user.email}`
        );
        if (riderRes.data?.role === "rider") return "rider";
      } catch (err) {}

      return "user"; // final fallback
    },
    enabled: !!user?.email,
    retry: 1,
    staleTime: 60_000,
  });
  // console.log(role);
  return { role, isLoading, isError };
}

export default useUserRole;
