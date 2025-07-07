import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

export default function MyEarnings() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["riderEarnings", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/rider/completed-parcels?email=${user.email}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  const calculateEarning = (parcel) => {
    const sameDistrict = parcel.senderRegion === parcel.receiverRegion;
    const rate = sameDistrict ? 0.8 : 0.3;
    return Math.round(parcel.deliveryCost * rate);
  };

  const now = new Date();
  const todayStr = now.toDateString();

  const isToday = (dateStr) => new Date(dateStr).toDateString() === todayStr;
  const isThisWeek = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    return date >= startOfWeek;
  };
  const isThisMonth = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  };
  const isThisYear = (dateStr) =>
    new Date(dateStr).getFullYear() === new Date().getFullYear();

  const earnings = {
    total: 0,
    cashout: 0,
    pending: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    thisYear: 0,
  };

  parcels.forEach((p) => {
    const earned = calculateEarning(p);
    earnings.total += earned;

    if (p.cashedOut) {
      earnings.cashout += earned;
    } else {
      earnings.pending += earned;
    }

    if (p.deliveredAt) {
      if (isToday(p.deliveredAt)) earnings.today += earned;
      if (isThisWeek(p.deliveredAt)) earnings.thisWeek += earned;
      if (isThisMonth(p.deliveredAt)) earnings.thisMonth += earned;
      if (isThisYear(p.deliveredAt)) earnings.thisYear += earned;
    }
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">📊 My Earnings Summary</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-100 p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-green-700">
            💰 Total Earned
          </h3>
          <p className="text-2xl font-bold text-black">৳ {earnings.total}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-blue-700">✅ Cashed Out</h3>
          <p className="text-2xl font-bold text-black">৳ {earnings.cashout}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-yellow-700">🕒 Pending</h3>
          <p className="text-2xl font-bold text-black">৳ {earnings.pending}</p>
        </div>
      </div>

      <h3 className="text-xl font-semibold mt-6">📅 Earnings Breakdown</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div className="bg-gray-100 p-4 rounded shadow">
          <h4 className="font-semibold text-black">Today</h4>
          <p className="text-xl font-bold text-green-600">৳ {earnings.today}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow">
          <h4 className="font-semibold text-black">This Week</h4>
          <p className="text-xl font-bold text-green-600">
            ৳ {earnings.thisWeek}
          </p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow">
          <h4 className="font-semibold text-black">This Month</h4>
          <p className="text-xl font-bold text-green-600">
            ৳ {earnings.thisMonth}
          </p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow">
          <h4 className="font-semibold text-black">This Year</h4>
          <p className="text-xl font-bold text-green-600">
            ৳ {earnings.thisYear}
          </p>
        </div>
      </div>
    </div>
  );
}
