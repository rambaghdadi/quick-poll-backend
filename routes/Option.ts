import express, { Router, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

const router: Router = express.Router()
const prisma = new PrismaClient({})

// Add New Vote
router.post("/option", async (req: Request, res: Response) => {
	try {
		const io = req.app.get("socket.io")
		const numOfVotes = await prisma.pollOption.findFirst({
			where: {
				id: req.body.id,
			},
			select: {
				vote: true,
				question: true,
			},
		})
		if (!numOfVotes) throw new Error("Choice not found.")
		if (req.cookies[numOfVotes.question.id] === "true")
			throw new Error("You have already voted in this poll.")
		const vote = await prisma.pollOption.update({
			where: {
				id: req.body.id,
			},
			data: {
				vote: numOfVotes.vote + 1,
				question: {
					update: {
						totalVotes: numOfVotes.question.totalVotes + 1,
					},
				},
			},
			include: {
				question: {
					include: {
						options: true,
					},
				},
			},
		})
		io.emit("poll", {
			updatedPost: vote.question,
		})
		res
			.status(200)
			.cookie(numOfVotes.question.id, "true", {
				httpOnly: true,
			})
			.json({ data: vote })
	} catch (error) {
		let err = error as Error
		res.status(400).json({ error: err.message })
	}
})

export default router
