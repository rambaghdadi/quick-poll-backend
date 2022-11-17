import jwt from "jsonwebtoken"

export default function token(req: any, res: any, next: any) {
	let errorStatus = 500
	let decodedToken: any
	let secret = process.env.SECRET

	try {
		const authHeader = req.get("Authorization")
		if (!authHeader) {
			errorStatus = 401
			throw new Error("Not Authenticated")
		}

		const token = authHeader.split(" ")[1]
		decodedToken = jwt.verify(token, secret)
		if (!decodedToken) {
			errorStatus = 401
			throw new Error("Not authenticated.")
		}
		req.body.userId = decodedToken.userId
		next()
	} catch (error) {
		const err = error as Error
		res.status(errorStatus).json({ message: err.message })
	}
}
