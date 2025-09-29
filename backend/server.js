//import
import express from "express";
//env
import dotenv from "dotenv";
//middleware
import cors from "cors";
import bodyParser from "body-parser";
//database
import database from "./Config/database.js";

//import

//
const app = express();
dotenv.config();

app.use(cors());
app.use(bodyParser.json());
//

//run
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is Runnig on Port ${port}`);
});
//run
