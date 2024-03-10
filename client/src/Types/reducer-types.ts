import { User, cartItem, shoppingInfo } from "./types";

export interface userReducerInitialState {
    user : User | null;
    loading : boolean;
}

// --------------------------------------------------------
// Cart Reducer
export interface cartReducerInitialState {
  loading : boolean;
  cartItems : cartItem[];
  subtotal : number;
  tax : number;
  shippingCharges : number;
  discount : number;
  total : number;
  shippingInfo : shoppingInfo ;
}

// --------------------------------------------------------
