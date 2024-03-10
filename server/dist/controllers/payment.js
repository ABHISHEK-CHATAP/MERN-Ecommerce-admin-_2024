import { stripe } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utils/utility-class.js";
export const createPaymentIntent = TryCatch(async (req, res, next) => {
    const { amount } = req.body;
    //   console.log("newCopon:",coupon,amount);
    if (!amount) {
        return next(new ErrorHandler("please enter amount", 400));
    }
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Number(amount) * 100,
        currency: "inr",
    });
    return res.status(201).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
    });
});
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
export const newCoupon = TryCatch(async (req, res, next) => {
    // req.body me 2 he hai => coupon ,amount agar bahot sare hote toh
    //express se Request, Response, nextFunction and Request ke types define krna padta alg se
    const { coupon, amount } = req.body;
    //   console.log("newCopon:",coupon,amount);
    if (!coupon || !amount) {
        return next(new ErrorHandler("please enter both coupon and amount", 400));
    }
    await Coupon.create({ coupon, amount });
    return res.status(201).json({
        success: true,
        message: `coupon ${coupon} has been created`,
    });
});
////////////////////////////////////////////////////////////////////////////////////////////
export const applyDiscount = TryCatch(async (req, res, next) => {
    const { coupon } = req.query;
    const Discount = await Coupon.findOne({ coupon });
    if (!Discount)
        return next(new ErrorHandler("Invalid coupon code", 400));
    return res.status(200).json({
        success: true,
        discount: Discount.amount,
    });
});
////////////////////////////////////////////////////////////////////////////////////////////
export const allCoupons = TryCatch(async (req, res, next) => {
    const coupons = await Coupon.findOne({});
    if (!coupons)
        return next(new ErrorHandler("coupons not found", 400));
    return res.status(200).json({
        success: true,
        coupons: coupons,
    });
});
////////////////////////////////////////////////////////////////////////////////////////////
export const deleteCoupon = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon)
        return next(new ErrorHandler("Invalid coupon ID", 400));
    return res.status(200).json({
        success: true,
        message: "coupon Deleted successfully",
    });
});
/////////////////////////////////////////////////////////////////////////////////////////
