const ErrorResponse = require("../utlis/errorResponse");
const Bootcamp = require("../models/Bootcamp");
// here we are going to cerate different mehtods
// that are going to used by different routers.
/* @desc Get all bootcamps
 * @route GET /api/v1/bootcamps
 * @access Public
 */
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    res
      .status(200)
      .json({ success: true, count: bootcamps.length, data: bootcamps });
  } catch (e) {
    next(e);
  }
  next();
};

/* @desc Get single bootcamps
 * @route GET /api/v1/bootcamps/:id
 * @access Public
 */
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    // guard clause for if bootcamp = null (which is falsy).
    console.log(bootcamp);
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id: ${req.params.id} `, 404),
      );
    }

    res.status(200).json({ success: true, data: bootcamp });
  } catch (e) {
    next(e);
  }
};

/* @desc Create new bootcamp
 * @route POST /api/v1/bootcamps/
 * @access Private
 */
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (e) {
    next(e);
  }

  next();
};

/* @desc Update new bootcamp
 * @route PUT /api/v1/bootcamps/:id
 * @access Private
 */
exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bootcamp)
      return new ErrorResponse(
        `Bootcamp not found with id: ${req.params.id}`,
        404,
      );

    res.status(200).json({ success: true, data: bootcamp });
  } catch (e) {
    next(e);
  }

  next();
};

/* @desc Delete new bootcamp
 * @route DELETE /api/v1/bootcamps/:id
 * @access Private
 */
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp)
      return new ErrorResponse(
        `Bootcamp not found with id of ${req.params.id}`,
        404,
      );
    res
      .status(200)
      .json({ success: true, data: `${bootcamp.name} has been deleted` });
  } catch (e) {
    next(e);
  }
  next();
};
