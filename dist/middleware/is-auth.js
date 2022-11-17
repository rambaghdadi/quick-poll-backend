import jwt from "jsonwebtoken";
export default function token(req, res, next) {
    var errorStatus = 500;
    var decodedToken;
    var secret = process.env.SECRET;
    try {
        var token_1 = req.cookies.userToken;
        if (!token_1) {
            errorStatus = 401;
            throw new Error("Not Authenticated");
        }
        decodedToken = jwt.verify(token_1, secret);
        if (!decodedToken) {
            errorStatus = 401;
            throw new Error("Not authenticated.");
        }
        req.body.userId = decodedToken.userId;
        next();
    }
    catch (error) {
        var err = error;
        res.status(errorStatus).json({ message: err.message });
    }
}
