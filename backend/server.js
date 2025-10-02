//import
import express from "express";
//env
import dotenv from "dotenv";
//middleware
import cors from "cors";
import bodyParser from "body-parser";
//database
import database from "./Config/database.js";
//route
import productRoute from "./Routes/productRoute.js"
import variantRoute from "./Routes/variantRoute.js"
//import

//
const app = express();
app.use(cors());
app.use(bodyParser.json());
dotenv.config();

//

//route

app.use(productRoute)
app.use(variantRoute)
//route

//run
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is Runnig on Port ${port}`);
});
//run
