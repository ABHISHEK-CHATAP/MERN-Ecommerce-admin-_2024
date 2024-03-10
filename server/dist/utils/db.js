import mongoose from "mongoose";
// const options: mongoose.ConnectOptions = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   };
export const connectDB = () => {
    mongoose
        .connect("mongodb+srv://Abhishek:Abhishek@cluster0.lg986fx.mongodb.net/Ecommerce2024?retryWrites=true&w=majority")
        .then((c) => console.log(`DB connected to ${c.connection.host}...`))
        .catch((err) => console.log(err));
};
