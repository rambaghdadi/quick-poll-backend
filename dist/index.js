import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import pollRoutes from "./routes/Poll.js";
import optionRoutes from "./routes/Option.js";
import helmet from "helmet";
var app = express();
var port = process.env.PORT;
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", true);
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "https://quickpolls.vercel.app/");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});
app.use(helmet());
app.use("/api", pollRoutes);
app.use("/api", optionRoutes);
app.listen(port, function () {
    console.log("Server Running on port ".concat(port, "!"));
});
