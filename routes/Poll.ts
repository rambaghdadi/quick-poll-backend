import express, { Router, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import isAuth from "../middleware/is-auth.js"

const router: Router = express.Router()
const prisma = new PrismaClient({})

// Get Poll
router.get("/poll/:id", async (req: Request, res: Response) => {
	try {
		const pollId = req.params.id
		const poll = await prisma.pollQuestion.findFirst({
			where: {
				id: pollId,
			},
			include: {
				options: true,
			},
		})
		if (poll?.endsAt.toLocaleDateString()! < new Date().toLocaleDateString())
			throw new Error("Poll expired.")
		if (!poll) throw new Error("Poll not found.")
		res.status(200).json({ data: poll })
	} catch (error) {
		let err = error as Error
		res.status(400).json({ error: err.message })
	}
})

// Get all user polls
router.get("/user/polls", isAuth, async (req: Request, res: Response) => {
	try {
		const poll = await prisma.pollQuestion.findMany({
			where: {
				userId: req.body.userId,
			},
			include: {
				options: true,
			},
		})
		res.status(200).json({ data: poll })
	} catch (error) {
		let err = error as Error
		res.status(400).json({ message: err.message })
	}
})

// Create new poll
router.post("/poll", async (req: Request, res: Response) => {
	try {
		if (req.body.question.length > 150)
			throw new Error("Only 150 characters are allowed.")
		if (req.body.question.length <= 1)
			throw new Error("More than 2 characters are required.")
		const poll = await prisma.pollQuestion.create({
			data: {
				question: req.body.question,
				secure: req.body.secure,
				allowNewOptions: req.body.allowNewOptions,
				optionLimit: req.body.optionLimit,
				endsAt: req.body.endsAt,
				options: {
					create: req.body.options,
				},

				userId: req.body.userId,
			},
		})
		res.status(200).json({ data: poll })
	} catch (error) {
		let err = error as Error
		res.status(400).json({ error: err.message })
	}
})

export default router
