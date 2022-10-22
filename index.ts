import "dotenv/config"

import http from "http"
import express, { Express } from "express"

import cookieParser from "cookie-parser"
import helmet from "helmet"

import { Server } from "socket.io"

import pollRoutes from "./routes/Poll.js"
import optionRoutes from "./routes/Option.js"

const port = process.env.PORT
const app: Express = express()
const server = http.createServer(app)
const io = new Server(server, {
	cors: {
		origin: "https://quickpolls.vercel.app",
		methods: ["GET", "POST", "DELETE", "PATCH", "PUT", "OPTIONS", "HEAD"],
		credentials: true,
	},
})

app.set("socket.io", io)
app.set("trust proxy", true)
app.use(express.json())
app.use(cookieParser())

//https://quickpolls.vercel.app
//http://localhost:3000

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "https://quickpolls.vercel.app")
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS"
	)
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Authorization, Accept"
	)
	res.setHeader("Access-Control-Allow-Credentials", "true")
	next()
})

app.use(helmet())

app.use("/api", pollRoutes)
app.use("/api", optionRoutes)

server.listen(port, () => {
	console.log(`Server Running on port ${port}.`)
})
