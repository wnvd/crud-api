const ErrorResponse = require("../utlis/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

// @desc Register User
// @route GET /api/v1/auth/register
// @access Public

exports.register = asyncHandler(async (req, res, next) => {
	const { name, email, password, role } = req.body;
	// create user
	const user = await User.create({
		name,
		email,
		password,
		role,
	});
	// we are using middleware to hash password

	// create token
	// small u because we are calling it on method
	const token = user.getSignJwtToken();

	res.status(200).json({ success: true, token:token });
});
