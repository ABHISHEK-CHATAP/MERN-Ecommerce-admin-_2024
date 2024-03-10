import {
    Elements,
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { newOrderRequest } from "../Types/api-types";
import { cartReducerInitialState, userReducerInitialState } from "../Types/reducer-types";
import { useNewOrderMutation } from "../redux/api/orderAPI";
import { resetCart } from "../redux/reducer/cartReducer";
import { responseToast } from "../utils/featues";
import { RootState } from "../redux/store";

const stripePromise = loadStripe(
  "pk_test_51Ok8vvSJbUcx7jciajsdtiaCieKmukjTZ2y66Psa5HSAK0VwiWphbSfc8Wv5rgonGM9n6fUzc84uu8ih3RqUptzL00mRZnogVx"
);

const CheckOut = () => {

    const location = useLocation();
    const clientSecret: string | undefined = location.state;

    if(!clientSecret){
        <Navigate to={"/shipping"}/>
    }

  return (
    <>
      <Elements
        stripe={stripePromise}
        options={{  clientSecret }} >
        <CheckOutForm />
      </Elements>
    </>
  );
};

export default CheckOut;

// ----------------------- checkout from ---------------------------------

const CheckOutForm = () => {

    const {user} = useSelector((state : RootState)=> state.userReducer);

    const {shippingInfo,cartItems,subtotal,tax,discount,shippingCharges,total} = useSelector((state : RootState)=> state.cartReducer );

    const [newOrder] = useNewOrderMutation();

  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsProcessing(true);

    const orderData : newOrderRequest = {
        shippingInfo,
        orderItems : cartItems,
        subtotal,
        tax,
        discount,
        shippingCharges,
        total,
        user : user?._id!,
    };

    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
      redirect: "if_required",
    });

    if (error) {
      setIsProcessing(false);
      return toast.error(error.message || "Something went wrong");
    }

    if (paymentIntent.status === "succeeded") {
        const res = await newOrder(orderData);
        dispatch(resetCart());
        console.log("placing order...");
        responseToast(res, navigate, "/orders");
    }
    setIsProcessing(false);
  };

  return (
    <>
      <div className="checkout-container">
        <form onSubmit={submitHandler}>
          <PaymentElement />
          <button type="submit" disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Pay"}
          </button>
        </form>
      </div>
    </>
  );
};
