import React from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

function PaymentHistory() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { isPending, data: payments = [] } = useQuery({
    queryKey: ["payments", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/payments/history?email=${user.email}`
      );
      return res.data;
    },
  });
  if (isPending) {
    return <p>...loading</p>;
  }
  console.log(payments);
  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Amount</th>
            <th>Parcel ID</th>
            <th>Transaction ID</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment._id}>
              <td>{payment.userName}</td>
              <td>{payment.email}</td>
              <td>${payment.amount}</td>
              <td>{payment.parcelId}</td>
              <td>{payment.transactionId}</td>
              <td>
                {new Date(payment.paymentDate).toLocaleDateString()}
                <p>
                  {new Date(payment.paymentDate).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true, // ensures AM/PM format
                  })}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PaymentHistory;
