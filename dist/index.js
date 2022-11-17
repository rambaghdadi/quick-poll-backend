import "dotenv/config";
import http from "http";
import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { Server } from "socket.io";
import pollRoutes from "./routes/Poll.js";
import optionRoutes from "./routes/Option.js";
import authRoutes from "./routes/Auth.js";
var port = process.env.PORT;
var app = express();
var server = http.createServer(app);
var io = new Server(server, {
    cors: {
        origin: "https://quickpolls.vercel.app",
        // origin: "http://localhost:3000",
        methods: ["GET", "POST", "DELETE", "PATCH", "PUT", "OPTIONS", "HEAD"],
        credentials: true,
    },
});
app.set("socket.io", io);
app.set("trust proxy", true);
app.use(express.json());
app.use(cookieParser());
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "https://quickpolls.vercel.app");
    // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization, Accept");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});
app.use(helmet());
app.use("/api", pollRoutes);
app.use("/api", optionRoutes);
app.use("/api", authRoutes);
server.listen(port, function () {
    console.log("Server Running on port ".concat(port, "."));
});
//backend validation
//add password
