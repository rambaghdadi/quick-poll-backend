import express, { Router, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

const router: Router = express.Router()
const prisma = new PrismaClient({})

// Add New Vote
router.post("/option/:optionId", async (req: Request, res: Response) => {
	try {
		const io = req.app.get("socket.io")
		const numOfVotes = await prisma.pollOption.findFirst({
			where: {
				id: req.params.optionId,
			},
			select: {
				vote: true,
				question: true,
			},
		})
		if (!numOfVotes) throw new Error("Choice not found.")
		const vote = await prisma.pollOption.update({
			where: {
				id: req.params.optionId,
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
		io.emit(req.body.pollId + "poll", {
			updatedPost: vote.question,
		})
		res.status(200).json({ data: vote })
	} catch (error) {
		let err = error as Error
		res.status(400).json({ error: err.message })
	}
})

export default router
