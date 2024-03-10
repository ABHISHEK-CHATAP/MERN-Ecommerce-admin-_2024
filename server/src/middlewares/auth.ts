import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";

// req.params => "/api/v1/users/id"
// re.query => "/api/v1/users/asdf?key=24"  => query me question mark lagake likhte hai pura object

//middleware to make sure only admin is allowed
export const adminOnly = TryCatch(
    async(req,res,next)=>{

        const {id} = req.query;
        // route/xys?id=jksds => to unlock adminOnly route middleware

        if(!id){ return next(new ErrorHandler("Invalid Credentials, login again ..", 401)); }

        const user : any = await User.findById(id);
        console.log("user :",user,user.role);

        if(!user){ return next(new ErrorHandler("Invalid Authentication ", 401)); }

        if(user.role !== 'admin'){
            return next(new ErrorHandler("Invalid Authorization ", 403));
        }
        
        next();
    }
)

// jaha bhi adminOnly middleware  hai  =>  same path ?id=_id

//  http://localhost:3001/api/v1/user/all?id=65c75c338c2a63375dd80721

// req.query => question mark id = _id = route me