import express, { Request, Response, Router } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient({})
const router: Router = express.Router()

router.post("/signin", async (req: Request, res: Response) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				email: req.body.email,
			},
		})
		if (!user) throw new Error("User does not exist.")
		const passwordEncryption = await bcrypt.compare(
			req.body.password,
			user.password
		)
		if (!passwordEncryption) throw new Error("Wrong password entered.")
		const token = jwt.sign(
			{
				email: user.email,
				userId: user.id,
			},
			process.env.SECRET,
			{ expiresIn: "48h" }
		)
		res
			.cookie("userToken", token, {
				httpOnly: true,
				secure: true,
				sameSite: "none",
				expires: new Date(Date.now() + 2 * 24 * 3600 * 1000),
				path: "/",
				domain: "https://quickpolls-backend.onrender.com",
			})
			.status(200)
			.json({ data: { userId: user.id, email: user.email, name: user.name } })
	} catch (error) {
		const err = error as Error
		res.status(400).json({ message: err.message })
	}
})

router.post("/signup", async (req: Request, res: Response) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				email: req.body.email,
			},
		})
		if (user) throw new Error("User already exists.")
		const hashedPassword = await bcrypt.hash(req.body.password, 12)
		const newUser = await prisma.user.create({
			data: {
				email: req.body.email,
				password: hashedPassword,
				name: req.body.name,
			},
		})
		res.status(200).json({ message: "User created.", data: newUser })
	} catch (error) {
		const err = error as Error
		res.status(400).json({ message: err.message })
	}
})

router.get("/signout", async (req: Request, res: Response) => {
	try {
		if (!req.cookies.userToken) {
			res.status(200).json({ message: "No cookies in request." })
			return
		}
		res.status(200).clearCookie("userToken").json({ message: "User cleared." })
	} catch (error) {
		res.status(400).json({ message: "Please try again later." })
	}
})

export default router
