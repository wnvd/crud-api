const express = require("express");
const { getUser,
        createUser, 
        updateUser, 
        deleteUser, 
        getUsers} = require("../controllers/users.js");
const User = require("../models/User.js");

const router = express.Router({ mergeParams: true });

const advancedResults = require("../middleware//advancedResults.js");
const { protect, authorize } = require("../middleware/auth.js");

router.use(protect);
router.use(authorize('admin'));

router
    .route('/')
        .get(advancedResults(User), getUsers)
        .post(createUser);

router
    .route('/:id')
        .get(getUser)
        .put(updateUser)
        .delete(deleteUser);

module.exports = router;
