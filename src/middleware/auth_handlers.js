import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import Admin from "../models/users/Admin.js";

class ProtectMiddleware {
	constructor(secret) {
		this.secret = secret;
	}

	async verifyToken(token) {
		try {
			return jwt.verify(token, this.secret);
		} catch (error) {
			throw new Error("Not Authorized");
		}
	}

	async authenticate(req, model, userType) {
		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith("Bearer")
		) {
			const token = req.headers.authorization.split(" ")[1];
			const decoded = await this.verifyToken(token);

			req[userType] = await model.findById(decoded.id).select("-password");
			if (!req[userType]) {
				throw new Error("User not found");
			}
		} else {
			throw new Error("Not Authorized");
		}
	}

	adminProtect = asyncHandler(async (req, res, next) => {
		try {
			await this.authenticate(req, Admin, "admin");
			next();
		} catch (error) {
			res.status(401);
			next(error.message);
		}
	});
}

export default ProtectMiddleware;