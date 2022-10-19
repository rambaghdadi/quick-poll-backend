import express, { Router, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

const router: Router = express.Router()
const prisma = new PrismaClient({})

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
		if (!poll) throw new Error("Poll not found.")
		res.status(200).json({ data: poll })
	} catch (error) {
		let err = error as Error
		res.status(400).json({ error: err })
	}
})

router.post("/poll", async (req: Request, res: Response) => {
	try {
		const poll = await prisma.pollQuestion.create({
			data: {
				question: req.body.question,
				allowNewOptions: req.body.allowNewOptions,
				optionLimit: req.body.optionLimit,
				options: {
					create: req.body.options,
				},
			},
		})
		res.status(200).json({ data: poll })
	} catch (error) {
		let err = error as Error
		res.status(400).json({ error: err })
	}
})

export default router
