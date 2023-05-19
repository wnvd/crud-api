const ErrorResponse = require("../utlis/errorResponse");
const asyncHandler = require("../middleware/async");
const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
const Review = require("../models/Review");

/* @desc    Get reviews 
 * @route   GET /api/v1/reviews
 * @route   GET /api/v1/reviews/:bootcampsId/reviews
 * @access  Public
 */
exports.getReviews = asyncHandler(async (req, res, next) => {
	if (req.params.bootcampId) {
		const reviews = await Review.find({ bootcamp: req.params.bootcampId });

		res.status(200).
			json({
				success: true,
				count: reviews.length,
				data: reviews,
			});
	} else {
		res.status(200).json(res.advancedResults);
	}
});
