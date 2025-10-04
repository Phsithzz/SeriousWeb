//import
import express from "express";
//env
import dotenv from "dotenv";
//middleware
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
//database
import database from "./Config/database.js";
//route
import productRoute from "./Routes/productRoute.js";
import variantRoute from "./Routes/variantRoute.js";
import userRoute from "./Routes/userRoute.js";
//import
dotenv.config();

//
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use("/img_basketball",express.static("img_basketball"))
app.use(bodyParser.json());
app.use(cookieParser());
//

//route
app.use(productRoute);
app.use(variantRoute);
app.use(userRoute);
//route

//run
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is Runnig on Port ${port}`);
});
//run
