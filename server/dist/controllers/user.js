import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "../middlewares/error.js";
export const newUser = TryCatch(async (req, res, next) => {
    // return next(new ErrorHandler("my custom error", 501));
    // return next(new ErrorHandler("ds"));
    const { name, email, photo, gender, _id, dob } = req.body;
    console.log("req.body :", name, email, photo, gender, _id, dob);
    // for user already login , just get _id and logged in
    let user = await User.findById(_id);
    if (user) {
        return res.status(200).json({
            success: true,
            message: `welcomee, ${user.name}`,
        });
    }
    if (!_id || !name || !email || !photo || !gender || !dob) {
        return next(new ErrorHandler("please add all feilds", 401));
    }
    //not already login the create login
    user = await User.create({
        _id,
        name,
        email,
        photo,
        gender,
        dob: new Date(dob),
    });
    return res.status(200).json({
        success: true,
        message: `welcome ${user.name}`,
    });
});
//////////////////////////////////////////////////////////////////////////////////////////
// ab bar-bar ==> req:Request {from express}, res:response, next:NextFunction
//define krne ki jaroorat nhi kyuki =>
// [[  TryCatch(fun:ControllerType)  ]]
//tryCatch function me jo bhi Controller function likhenge usko alag se define
//kiya hai typescript me
//////////////////////////////////////////////////////////////////////////////////////////
// GET => ALL Logged-In Users
export const getAllUsers = TryCatch(async (req, res, next) => {
    const users = await User.find({});
    res.status(200).json({
        success: true,
        users,
    });
});
//////////////////////////////////////////////////////////////////////////////////////////
export const getUser = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorHandler("Invalid Id", 400));
    }
    res.status(200).json({
        success: true,
        user,
    });
});
//////////////////////////////////////////////////////////////////////////////////////////
export const deleteUser = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorHandler("Invalid Id", 400));
    }
    await User.deleteOne();
    res.status(200).json({
        success: true,
        message: "user deleted successfully",
    });
});
//////////////////////////////////////////////////////////////////////////////////////////
