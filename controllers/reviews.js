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

/* @desc    Get single review 
 * @route   GET /api/v1/reviews/:id
 * @access  Public
 */
exports.getReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if(!review){
        return next(new ErrorResponse(`No review with the ID of ${req.params.id}`, 404));
    }
    
    res.status(200).json({
        success: true,
        data: review
    })
});

/* @desc    Add a review 
 * @route   POST /api/v1/bootcamps/:bootcampId/reviews
 * @access  Private
 */
exports.addReview = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if(!bootcamp){
        return next(new ErrorResponse(`No bootcamp of ID ${req.params.bootcampId} exists`, 404));
    }
   
    const review = await Review.create(req.body);
    res.status(201).json({
        success: true,
        data: review
    })
});
