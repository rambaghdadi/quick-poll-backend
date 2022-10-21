import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import pollRoutes from "./routes/Poll.js";
import optionRoutes from "./routes/Option.js";
import helmet from "helmet";
var app = express();
var port = process.env.PORT;
app.set("trust proxy", true);
app.use(express.json());
app.use(cookieParser());
//https://quickpolls.vercel.app
//http://localhost:3000
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "https://quickpolls.vercel.app");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization, Accept");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});
app.use(helmet());
app.use("/api", pollRoutes);
app.use("/api", optionRoutes);
app.listen(port, function () {
    console.log("Server Running on port ".concat(port, "!"));
});
