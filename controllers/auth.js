const crypto = require("node:crypto");
const ErrorResponse = require("../utlis/errorResponse");
const asyncHandler = require("../middleware/async");
const sendEmail = require("../utlis/sendEmail.js");
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

	sendTokenResponse(user, 200, res);
    next();
});

// @desc Login User
// @route POST /api/v1/auth/login
// @access Public

exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	// validate email and password
	if (!email || !password) {
		return next(
			new ErrorResponse("Please provide an email and password", 400),
		);
	}
	// check for user
	const user = await User.findOne({ email: email }).select("+password");

	if (!user) {
		return next(new ErrorResponse("Invalid credentials", 401));
	}
	// check if password matches
	const isMatch = await user.matchPassword(password);
	if (!isMatch) {
		return next(new ErrorResponse("Invalid credentials", 401));
	}

	sendTokenResponse(user, 200, res);
});

// @desc Get current logged in user
// @route POST /api/v1/auth/me
// @access Private
exports.getMe = asyncHandler(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email});

    if(!user) {
        return next( 
            new ErrorResponse("There is no user of the email")
        );
    }

	res.status(200).json({
		success: true,
		data: user
	});
	next()
});

// @desc Forgot password
// @route POST /api/v1/auth/forgotpassword
// @access Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });

    if(!user) {
        return next( new ErrorResponse("There is no user with that email", 404));
    }

    // Get Reset Token
    const resetToken = user.getResetPasswordToken();
    
    await user.save({ validateBeforeSave: false});
    // create  reset url
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetURL}`;
    
    try{
        
        await sendEmail({
            email: user.email,
            subject: 'Password Reset',
            message
        });

    }catch(err){
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave: false});

        return next( 
            new ErrorResponse('Email could not be sent'), 500);
    }
	res.status(200).json({
		success: true,
		data: 'Email sent.'
	});

});

// @desc Reset Password
// @route PUT /api/v1/auth/resertpassword/:resettoken
// @access Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
    // Get Hashed Token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

	const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()}
    });

    if(!user) {
        return next( 
            new ErrorResponse("Invalid Token", 400)
        );
    }
    
    // Set new Password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendTokenResponse(user, 200, res);
});

// Helper Function
// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
	// create token
	const token = user.getSignJwtToken();

	const options = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 1000,
		),
		httpOnly: true,
	};
	if(process.env.NODE_ENV=== 'production') {
		options.secure = true
	}
	// "token" is key  and token is actual token
	res.status(statusCode).cookie("token", token, options).json({
		success: true,
		token,
	});
};

