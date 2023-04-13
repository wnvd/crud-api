const path = require("path");
const ErrorResponse = require("../utlis/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utlis/geocoder");
const Bootcamp = require("../models/Bootcamp");
// here we are going to cerate different mehtods
// that are going to used by different routers.
/* @desc Get all bootcamps
 * @route GET /api/v1/bootcamps
 * @access Public
 */
// -- old way of doing it
// exports.getBootcamps = async (req, res, next) => {
//   try {
//     const bootcamps = await Bootcamp.find();
//     res
//       .status(200)
//       .json({ success: true, count: bootcamps.length, data: bootcamps });
//   } catch (e) {
//     next(e);
//   }
//   next();
// };
exports.getBootcamps = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults);
});

/* @desc Get single bootcamps
 * @route GET /api/v1/bootcamps/:id
 * @access Public
 */
exports.getBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);
	// guard clause for if bootcamp = null (which is falsy).
	if (!bootcamp) {
		return next(
			new ErrorResponse(
				`Bootcamp not found with id: ${req.params.id} `,
				404,
			),
		);
	}

	res.status(200).json({ success: true, data: bootcamp });
});

/* @desc Create new bootcamp
 * @route POST /api/v1/bootcamps/
 * @access Private
 */
exports.createBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.create(req.body);
	res.status(201).json({
		success: true,
		data: bootcamp,
	});
	next();
});

/* @desc Update new bootcamp
 * @route PUT /api/v1/bootcamps/:id
 * @access Private
 */
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});
	if (!bootcamp)
		return next(
			new ErrorResponse(
				`Bootcamp not found with id: ${req.params.id}`,
				404,
			),
		);

	res.status(200).json({ success: true, data: bootcamp });
});

/* @desc Delete new bootcamp
 * @route DELETE /api/v1/bootcamps/:id
 * @access Private
 */
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);
	if (!bootcamp)
		return next(
			new ErrorResponse(
				`Bootcamp not found with id of ${req.params.id}`,
				404,
			),
		);

	bootcamp.deleteOne();
	res.status(200).json({
		success: true,
		data: `${bootcamp.name} has been deleted`,
	});
});

/*
 * @desc Get bootcamps within radius
 * @route GET /api/v1/bootcamps/radius/:zipcode/:distance
 * @access Private
 */
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
	const { zipcode, distance } = req.params;

	// Get lat/long from geocoder
	const loc = await geocoder.geocode(zipcode);
	const lat = loc[0].latitude;
	const lng = loc[0].longitude;

	// Cal radius using radians
	// divide dist by radius of earth
	// earth radious = 3,963 mi , 6,378 kms
	const radius = distance / 6378;
	const bootcamps = await Bootcamp.find({
		location: {
			$geoWithin: {
				$centerSphere: [[lat, lng], radius],
			},
		},
	});
	res.status(200).json({
		success: true,
		count: bootcamps.length,
		data: bootcamps,
	});
});

// @desc  Upload photo for bootcamp
// @route PUT /api/v1/bootcamps/:id/photo
// @access Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);

	if (!bootcamp) {
		return next(
			new ErrorResponse(
				`Bootcamp not found with the id of ${req.params.id}`,
				404,
			),
		);
	}
	if (!req.files) {
		return next(new ErrorResponse(`Please upload a file`, 400));
	}
	const file = req.files.file;

	// make sure image is a photo.
	if (!file.mimetype.startsWith("image")) {
		return next(
			new ErrorResponse(`Please upload a file that is an image`, 400),
		);
	}

	// check file size
	if (file.size > process.env.MAX_FILE_UPLOAD) {
		return next(
			new ErrorResponse(
				`Please upload an image less the ${process.env.MAX_FILE_UPLOAD}`,
				400,
			),
		);
	}

	// create custom filename
	file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
	file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
		if (err) {
			console.log(err);
			return next(new ErrorResponse(`Problem with file upload`), 500);
		}
		await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
		res.status(200).json({
			success: true,
			data: file.name,
		});
	});
});
