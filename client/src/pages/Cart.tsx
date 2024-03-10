import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { cartReducerInitialState } from "../Types/reducer-types";
import { cartItem } from "../Types/types";
import CartItem from "../components/cart-Item/CartItem";
import {
  addToCart,
  calculatePrice,
  discountApplied,
  removeCartItem,
} from "../redux/reducer/cartReducer";
import axios from "axios";
import { server } from "../redux/store";

// alt + shift = o => for arrange all imports squentially

const Cart = () => {
  const { cartItems, subtotal, tax, total, shippingCharges, discount } =
    useSelector(
      (state: { cartReducer: cartReducerInitialState }) => state.cartReducer
    );

  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

  const dispatch = useDispatch();

  const IncrementQuantity = (cartItem: cartItem) => {
    if (cartItem.quantity >= cartItem.stock)
      return toast.error("Out of stock quantity");
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
  };

  const decrementQuantity = (cartItem: cartItem) => {
    if (cartItem.quantity <= 1) return;
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
  };

  const RemoveHandler = (productId: string) => {
    dispatch(removeCartItem(productId));
  };

  useEffect(() => {
    // to avoid unecessary network calls for
    //fetch => abort Controller()
    // for axios => cancel token
    // CancelToken  => capital "C" logo toh error ayega
    const { token: cancelToken, cancel } = axios.CancelToken.source();

    const timeOutId = setTimeout(() => {
      axios
        .get(`${server}/api/v1/payment/coupon/discount?coupon=${couponCode}`, {
          cancelToken,
        })
        .then((res) => {
          // console.log("coupon :", res.data);
          dispatch(discountApplied(res?.data?.discount));
          setIsValidCouponCode(true);
          dispatch(calculatePrice());
        })
        .catch(() => {
          // console.log("coupon error :", error?.response?.data?.message);
          dispatch(discountApplied(0));
          setIsValidCouponCode(false);
          dispatch(calculatePrice());
        });
    }, 1000);

    return () => {
      clearTimeout(timeOutId);
      cancel();
      setIsValidCouponCode(false);
    };
  }, [couponCode]);

  //useEffect for price
  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems]);

  return (
    <>
      <div className="cart">
        <main>
          {cartItems.length > 0 ? (
            cartItems.map((i, idx) => {
              return (
                <>
                  <CartItem
                    key={idx}
                    cartItem={i}
                    IncrementQuantity={IncrementQuantity}
                    decrementQuantity={decrementQuantity}
                    RemoveHandler={RemoveHandler}
                  />
                </>
              );
            })
          ) : (
            <h1>No Item Added</h1>
          )}
        </main>

        <aside>
          <p>Subtotal : ₹ {subtotal}</p>
          <p>Shipping Charges : ₹ {shippingCharges}</p>
          <p>Tax : ₹ {tax}</p>
          <p>
            Discount : <em className="red"> - ₹{discount}</em>{" "}
          </p>
          <p>
            <b>Total : ₹ {total} /-</b>
          </p>

          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="coupon code"
          />
          {couponCode &&
            (isValidCouponCode ? (
              <span className="green">
                ₹ {discount} off using coupon code - <code>{couponCode}</code>
              </span>
            ) : (
              <span className="red">
                <VscError /> Invalid Coupon{" "}
              </span>
            ))}

          {cartItems.length > 0 && <Link to={"/shipping"}>checkout</Link>}
        </aside>
      </div>
    </>
  );
};

export default Cart;
