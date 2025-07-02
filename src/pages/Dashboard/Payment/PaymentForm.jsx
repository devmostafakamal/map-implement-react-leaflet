import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState("");
  const { parcelId } = useParams();
  const axiosSecure = useAxiosSecure();
  const { isPending, data: parcelInfo = {} } = useQuery({
    queryKey: ["parcels", parcelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${parcelId}`);
      return res.data;
    },
  });
  if (isPending) {
    return <p>......is pending</p>;
  }

  console.log(parcelInfo);
  const amount = parcelInfo.deliveryCost;
  const amountInCents = amount * 100;
  console.log(amountInCents);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    const card = elements.getElement(CardElement);
    if (!card) {
      return;
    }
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
      billing_details: {
        name: user?.displayName || "Unknown",
        email: user?.email || "noemail@example.com",
      },
    });
    if (error) {
      setError(error.message);
      return;
    } else {
      setError("");
      console.log("payment method", paymentMethod);
    }

    //step-2 create payment intent
    const res = await axiosSecure.post("/create-payment-intent", {
      amountInCents,
      parcelId,
    });
    console.log("res from intent", res);
    const clientSecret = res.data.clientSecret;

    // Step 3: Confirm payment using clientSecret
    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

    if (confirmError) {
      setError(confirmError.message);
      console.error("❌ Payment confirmation error:", confirmError);

      // SweetAlert দিয়ে এরর মেসেজ দেখানো
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: confirmError.message,
        confirmButtonText: "Try Again",
      });
    } else if (paymentIntent.status === "succeeded") {
      console.log("✅ Payment succeeded:", paymentIntent);

      // SweetAlert দিয়ে সাকসেস মেসেজ দেখানো (ট্রানজেকশন আইডি সহ)
      Swal.fire({
        icon: "success",
        title: "Payment Successful!",
        html: `
            <div>
              <p>Your payment has been processed successfully</p>
              <p><strong>Transaction ID:</strong> ${paymentIntent.id}</p>
              <p><strong>Amount:</strong> $${(amountInCents / 100).toFixed(
                2
              )}</p>
            </div>
          `,
        confirmButtonText: "OK",
        footer: "Thank you for your payment",
      });
      navigate("/dashboard/myParcels");

      // ব্যাকেন্ডে পেমেন্ট ডেটা সেভ করা
      await axiosSecure.post("/payments", {
        parcelId,
        transactionId: paymentIntent.id,
        amount: amountInCents / 100,
        email: user.email,
        userName: user.displayName,
      });
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto"
      >
        <CardElement></CardElement>
        <button
          type="submit"
          disabled={!stripe}
          className="btn btn-primary w-full text-black"
        >
          Pay ${amount}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}

export default PaymentForm;
