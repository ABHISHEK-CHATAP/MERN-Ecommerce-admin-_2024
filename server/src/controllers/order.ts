import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewOrderRequestBody } from "../types/types.js";
import { Order } from "../models/order.js";
import { reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";
import { myCache } from "../app.js";

export const newOrder = TryCatch(
  async (req: Request<{}, {}, NewOrderRequestBody>, res, next) => {
    const {
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
    } = req.body;

    if (!shippingInfo || !orderItems || !user || !subtotal || !tax || !total) {
      return next(new ErrorHandler("please enter all fields", 400));
    }

    await Order.create({
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
    });

    await reduceStock(orderItems);

    return res.status(201).json({
      success: true,
      message: "order placed successfully",
    });
  }
);

////////////////////////////////////////////////////////////////////////////////////

export const myOrders = TryCatch(async (req, res, next) => {
  const { id: user } = req.query;

  let orders = [];

  orders = await Order.find({ user });

  return res.status(200).json({
    success: true,
    orders,
  });
});

////////////////////////////////////////////////////////////////////////////////////
//using NodeCache

export const allOrders = TryCatch(async (req, res, next) => {
  // let orders=[];
  // orders = await Order.find();

  //without NodeCahe = just 2 line but performance not good takes 40-50 ms in postman
  // ------------------------------------------------------------------------

  //using NodeCache =
  const key = `all-orders`;
  let orders = [];

  if (myCache.has(key)) {
    orders = JSON.parse(myCache.get(key) as string);
  } else {
    orders = await Order.find().populate("user", "name");
    myCache.set(key, JSON.stringify(orders));
  }

  // ye NodeCache aaise he if-else me rahega - better way to create a separate function,
  // just pass [key] and [functinality store in variable] as argument
  return res.status(200).json({
    success: true,
    orders,
  });
});

////////////////////////////////////////////////////////////////////////////////////

//  orders = await Order.find().populate("user")  => populate se user ki id thi toh pura object with role , alag object create hua
// but uss object me name he chahiye [ populate("user", "name") ] limited dhikhayega

////////////////////////////////////////////////////////////////////////////////////

export const getSingleOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  //using NodeCache =
  const key = `order-${id}`;
  let order;

  if (myCache.has(key)) {
    order = JSON.parse(myCache.get(key) as string);
  } else {
    order = await Order.findById(id).populate("user", "name");

    if (!order) return next(new ErrorHandler("Order not found", 404));

    myCache.set(key, JSON.stringify(order));
  }

  return res.status(200).json({
    success: true,
    order,
  });
});

////////////////////////////////////////////////////////////////////////////////////

export const updateProcessOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id);

  if (!order) return next(new ErrorHandler("Order not found", 404));

  switch (order.status) {
    case "Processing": order.status = "Shipped";
      break;

    case "Shipped": order.status = "Delivered";
      break;

    default: order.status = "Delivered";
      break;
  }

  await order.save();

  return res.status(200).json({
    success: true,
    message: "order process updated successfully",
  });
});

////////////////////////////////////////////////////////////////////////////////////


export const deleteOrder = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findById(id);
  
    if (!order) return next(new ErrorHandler("Order not found", 404));
  
    await order.deleteOne();
  
    return res.status(200).json({
      success: true,
      message: "order deleted successfully",
    });
  });
  
  ////////////////////////////////////////////////////////////////////////////////////