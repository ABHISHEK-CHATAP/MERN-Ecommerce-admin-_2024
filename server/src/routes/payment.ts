import  express  from "express";
import { adminOnly } from "../middlewares/auth.js";
import { allCoupons, applyDiscount, createPaymentIntent, deleteCoupon, newCoupon } from "../controllers/payment.js";

const app = express.Router();

//order place by  - stripe payment
// route - /api/v1/payment/create
app.post("/create", createPaymentIntent);


// Create new coupon - /api/v1/payment/coupon/new
app.post("/coupon/new",adminOnly, newCoupon);

// Create discount on coupon - /api/v1/payment/coupon/discount
app.get("/coupon/discount", applyDiscount);

// Create new coupon - /api/v1/payment/coupon/all
app.get("/coupon/all", allCoupons);

// Create new coupon - /api/v1/payment/coupon/:id
app.delete("/coupon/:id",adminOnly, deleteCoupon);


export default app;