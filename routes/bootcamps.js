const express = require("express");
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
} = require("../controllers/bootcamps");

// include other resource router
const courserRouter = require("./courses");

const router = express.Router();

// Re-route into other resource routers
router.use("/:bootcampId/courses", courserRouter);

// '/:zipcode/:distance'
router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
// '/'
router.route("/").get(getBootcamps).post(createBootcamp);
// ':id'
router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
