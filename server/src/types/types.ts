import { NextFunction, Request, Response } from "express";

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

//////////////////////////////////////////////////////////////
//user.ts

// User Log-in Type
export interface NewUserRequestBody {
  name: string;
  email: string;
  photo: string;
  role: string;
  gender: string;
  _id: string;
  dob: Date;
}

//////////////////////////////////////////////////////////////
//product.ts

// new Product Type
export interface NewProductRequestBody {
  name: string;
  category: string;
  price: number;
  stock: number;
}

// used in Product SearchProducts controller

export type SearchRequestQuery = {
  search?: string;
  price?: string;
  category?: string;
  sort?: string;
  page?: string;
};

export interface BaseQuery {
  name?: {
    $regex: string;
    $options: string;
  };
  price?: { $lte: number };
  category?: string;
}

//////////////////////////////////////////////////////////////
//Order.ts

// Order Types
export interface NewOrderRequestBody {
  shippingInfo: shippingInfoType;
  user: string;
  subtotal: string;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
// status : ennum and default me set hai 
  orderItems: orderItemType[];
}


export type orderItemType = {
  name: string;
  photo: string;
  price: number;
  quantity: number;
  productId: string;
};


export type shippingInfoType = {
    address: string;
    city: string;
    state: string;
    country: string;
    pinCode: number;
  };

//////////////////////////////////////////////////////////////
