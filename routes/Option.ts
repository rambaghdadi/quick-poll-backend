import express, { Router, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

const router: Router = express.Router()
const prisma = new PrismaClient({})

router.post("/option", async (req: Request, res: Response) => {
	try {
		// Add New Vote
		console.log("x-real-ip", req.headers["x-real-ip"])
		console.log("req.ip", req.ip)
		console.log("x-forwarded-for", req.headers["x-forwarded-for"])
		console.log("req.ips", req.ips)
		console.log("test")

		const ip = req.ip
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
		if (numOfVotes.question.voters.includes(ip))
			throw new Error("You have already voted in this poll.")
		const vote = await prisma.pollOption.update({
			where: {
				id: req.body.id,
			},
			data: {
				vote: numOfVotes.vote + 1,
				voters: ip,
				question: {
					update: {
						voters: ip,
						totalVotes: numOfVotes.question.totalVotes + 1,
					},
				},
			},
		})
		res.status(200).json({ data: vote })
	} catch (error) {
		let err = error as Error
		res.status(400).json({ error: err.toString() })
	}
})

export default router
