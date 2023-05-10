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

// @desc Login User
// @route POST /api/v1/auth/login
// @access Public

exports.login = asyncHandler(async (req, res, next) => {
	const {email, password} = req.body;

	// validate email and password	
	if(!email || !password) {
		return next(new ErrorResponse('Please provide an email and password', 400));
	}
	// check for user
	const user = await User.findOne({email: email}).select('+password');

	if(!user) {
		return next(new ErrorResponse('Invalid credentials', 401));
	}
	// check if password matches
	const isMatch = await user.matchPassword(password);
	if(!isMatch) {
		return  next(new ErrorResponse('Invalid credentials', 401));
	}
	// create token
	// small u because we are calling it on method
	const token = user.getSignJwtToken();

	res.status(200).json({ success: true, token:token });
});