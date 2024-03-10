import axios from "axios";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { cartReducerInitialState } from "../Types/reducer-types";
import { saveShippingInfo } from "../redux/reducer/cartReducer";
import { server } from "../redux/store";

// "pi_3OnitkSJbUcx7jci0KzMdgFk_secret_zfyyd5688iwQZe2XuarRrBnwx"

const Shipping = () => {
  const dispatch = useDispatch();
    const navigate= useNavigate();

    const { cartItems, total } =
    useSelector(
      (state: { cartReducer: cartReducerInitialState }) => state.cartReducer
    );
    
    const [shippingInfo, setShippingInfo]=useState({
        address:"",
        city:"",
        state:"",
        country:"",
        pinCode:"",
    });

    const changeHandler = (e : ChangeEvent<HTMLInputElement | HTMLSelectElement >)=>{
        setShippingInfo((prev)=> ({...prev, [e.target.name]: e.target.value}));
    }
    
    const submitHandler=async(e:FormEvent<HTMLFormElement>)=>{
      e.preventDefault();

      dispatch(saveShippingInfo(shippingInfo));

      try {
        const {data} = await axios.post(`${server}/api/v1/payment/create`,
        {amount : total,},
        {
          headers : {
            "Content-Type" : "application/json",
          }
        }
        );
        navigate("/pay", {state: data.clientSecret})
      } catch (error) {
        console.log("shipping error", error);
        toast.error("shipping went wrong")
      }
    }

    useEffect(()=>{
    if(cartItems.length <= 0 ) return navigate("/cart");
        
    },[])
  return (
    <>
    <div className="shipping">
        <button className="back-btn" onClick={()=>navigate("/cart")}><BiArrowBack/></button>

        <form onSubmit={submitHandler}>
            <h1>Shipping Address</h1>
            <input type="text" placeholder="address" name="address" value={shippingInfo.address} onChange={changeHandler}/>
            <input type="text" placeholder="city" name="city" value={shippingInfo.city} onChange={changeHandler}/>
            <input type="text" placeholder="state" name="state" value={shippingInfo.state} onChange={changeHandler}/>
            <select name="country" required value={shippingInfo.country} onChange={changeHandler}>
                <option value="">Choose Country</option>
                <option value="india">India</option>
            </select>
            <input type="number" placeholder="pinCode" name="pinCode" value={shippingInfo.pinCode} onChange={changeHandler}/>
            <button type="submit">pay now</button>
        </form>
    </div>
    
    </>
  )
}

export default Shipping

