const ErrorResponse = require("../utlis/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utlis/geocoder");
const Bootcamp = require("../models/Bootcamp");
const { json } = require("body-parser");
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
  let query;
  // copy req.Query
  const reqQuery = { ...req.query };
  // fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // loop and removefields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);
  // create query string
  let queryStr = JSON.stringify(reqQuery);
  // here we are using regex to replace gt/gte/lt.. to $gt/$gte/$lt
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`,
  );
  query = Bootcamp.find(JSON.parse(queryStr)).populate({
    path: "courses",
    select: "name description",
  });

  //Select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // exec query
  const bootcamps = await query;

  // Pagination result
  const Pagination = {};

  if (endIndex < total) {
    Pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    Pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    Pagination,
    data: bootcamps,
  });
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
      new ErrorResponse(`Bootcamp not found with id: ${req.params.id} `, 404),
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
      new ErrorResponse(`Bootcamp not found with id: ${req.params.id}`, 404),
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
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404),
    );

  bootcamp.deleteOne();
  res
    .status(200)
    .json({ success: true, data: `${bootcamp.name} has been deleted` });
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
