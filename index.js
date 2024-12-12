import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import route from "./routes/userRoute.js"

const app = express();
app.use(bodyParser.json());
dotenv.config();
app.use(express.static('public'));

const PORT = process.env.PORT || 7000;
const  MONGOURL = process.env.MONGO_URL;

mongoose.connect(MONGOURL).then(()=>{
    console.log("database connected successfully");
    app.listen(PORT, ()=>{
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error)=>console.log(error));


app.use("/api/user", route)