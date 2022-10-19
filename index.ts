import "dotenv/config"
import express, { Express } from "express"
import cookieParser from "cookie-parser"

import pollRoutes from "./routes/Poll.js"
import optionRoutes from "./routes/Option.js"

const app: Express = express()
const port = process.env.PORT

app.use(express.json())
app.use(cookieParser())

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*")
	// res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000")
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS"
	)
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
	res.setHeader("Access-Control-Allow-Credentials", "true")
	next()
})

app.use("/api", pollRoutes)
app.use("/api", optionRoutes)

app.listen(port, () => {
	console.log(`Server Running on port ${port}!`)
})
