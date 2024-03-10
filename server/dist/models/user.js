import { Schema, model } from "mongoose";
import validator from "validator";
const schema = new Schema({
    _id: {
        type: String,
        required: ["true", "please enter ID"],
    },
    name: {
        type: String,
        required: ["true", "please enter Name"],
    },
    email: {
        type: String,
        unique: [true, "Email already exists"],
        required: ["true", "please enter Name"],
        validate: validator.default.isEmail,
    },
    photo: {
        type: String,
        required: ["true", "please add Photo"],
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: ["true", "please enter gender"],
    },
    dob: {
        type: Date,
        required: ["true", "please enter Date of birth"],
    },
}, {
    timestamps: true,
});
schema.virtual("age").get(function () {
    const today = new Date();
    const dob = this.dob;
    let age = today.getFullYear() - dob.getFullYear();
    if (today.getMonth() < dob.getMonth() || today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate()) {
        age--;
    }
    return age;
});
export const User = model("User", schema);
