import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    name: {
      type: String,
      required: ["true", "please enter Name"],
    },
    photo: {
      type: String,
      required: ["true", "please add photo"],
    },
    price: {
      type: Number,
      required: ["true", "please enter price"],
    },
    stock: {
      type: Number,
      required: ["true", "please enter stock"],
    },
    category: {
      type: String,
      required: ["true", "please enter product category"],
    },
  },
 {
    timestamps: true,
  }
);

export const Product = model("Product", schema);
