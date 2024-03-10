import  express  from "express";
import { deleteUser, getAllUsers, getUser, newUser } from "../controllers/user.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();

//route - /api/v1/user/new
app.post("/new",newUser);

//route- /api/v1/user/all?id=jksds
app.get("/all",adminOnly, getAllUsers);

// slash ke baad jo bhi likhenge woh id hogi, siwaay
// slash new , slash all ke 
// kyuki woh id ke uper hai & uper he hone chahiye


// app.get("/:id", getUser)

// app.delete("/:id", deleteUser)

//above dono path same bus controller different hai toh chainning karenge

app.route("/:id").get( getUser).delete(adminOnly, deleteUser);

export default app;

