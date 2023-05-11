const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utlis/errorResponse");
const User = require("../models/User");

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
		console.log(token);
	}
	// else if(req.cookies.token) {
	//      token = req.cookies.token;
	// }

	// Make sure token exists
	if (!token) {
		return next(new ErrorResponse("Not Authorized to access this route."));
	}
	try {
		// verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = await User.findById(decoded.id);
		next();
	} catch (err) {
		return next(new ErrorResponse("Not Authorized to access this route."));
	}
});
