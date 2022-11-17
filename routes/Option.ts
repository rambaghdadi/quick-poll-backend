import express, { Router, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"

const router: Router = express.Router()
const prisma = new PrismaClient({})

// Add New Vote
router.post("/option/:optionId", async (req: Request, res: Response) => {
	const io = req.app.get("socket.io")

	let signedInUser: any = null
	let decodedToken: any

	try {
		const token = req.cookies.userToken
		if (token) {
			decodedToken = jwt.verify(token, process.env.SECRET)
			if (decodedToken) {
				signedInUser = decodedToken.userId
			}
		}

		const option = await prisma.pollOption.findFirst({
			where: {
				id: req.params.optionId,
			},
			include: {
				question: true,
			},
		})
		if (!option) throw new Error("Choice not found.")

		if (option?.question.secure) {
			if (!signedInUser) throw new Error("You need to be signed in to vote.")
			if (option.question.signedInVoters.includes(signedInUser))
				throw new Error("You have already voted in this poll.")
			const vote = await prisma.pollOption.update({
				where: {
					id: req.params.optionId,
				},
				data: {
					vote: option.vote + 1,
					question: {
						update: {
							totalVotes: option.question.totalVotes + 1,
							signedInVoters: {
								push: signedInUser,
							},
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
			return
		}

		const vote = await prisma.pollOption.update({
			where: {
				id: req.params.optionId,
			},
			data: {
				vote: option.vote + 1,
				question: {
					update: {
						totalVotes: option.question.totalVotes + 1,
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
