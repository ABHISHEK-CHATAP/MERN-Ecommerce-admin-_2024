import mongoose from "mongoose";
const schema = new mongoose.Schema({
    coupon: {
        type: String,
        required: [true, "please enter the coupon code"],
        unique: true,
    },
    amount: {
        type: Number,
        required: [true, "please enter the Discount amount"],
    },
});
export const Coupon = mongoose.model("Coupon", schema);
