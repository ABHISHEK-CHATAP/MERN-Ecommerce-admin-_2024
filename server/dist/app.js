import express from 'express';
import cors from 'cors';
import { errorMiddleware } from './middlewares/error.js';
import NodeCache from 'node-cache';
import { connectDB } from './utils/db.js';
import { config } from 'dotenv';
import Stripe from 'stripe';
connectDB();
config({
    path: "./.env",
});
// below config() .env variables will run
//creating instance for myCache
export const myCache = new NodeCache();
const port = process.env.PORT || 3001;
const stripeKey = process.env.STRIPE_KEY || "";
export const stripe = new Stripe(stripeKey);
// Importing Routes
import userRoute from "./routes/user.js";
import productRoute from "./routes/product.js";
import orderRoute from "./routes/orders.js";
import paymentRoute from "./routes/payment.js";
import dashboardRoute from "./routes/admin-dash.js";
const app = express();
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
    res.send("home route");
});
//Using Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", dashboardRoute);
app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);
app.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}...._`);
});
