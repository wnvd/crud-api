const express = require("express");
const { register, 
        login, 
        getMe,  
        logout,  
        forgotPassword, 
        resetPassword, 
        updateDetails, 
        updatePassword } = require("../controllers/auth");
const { protect } = require("../middleware/auth");
const router = express.Router();

router.post("/register", register);
router.get("/login", login);
router.get("/logout", logout)
router.get("/me", protect, getMe);
router.put("/updatedetails", protect, updateDetails);
router.put("/updatepassword", protect, updatePassword);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);

module.exports = router;
