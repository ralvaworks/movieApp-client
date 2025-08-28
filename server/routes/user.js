const express = require("express");
const userController = require("../controllers/user");

const { verify, verifyAdmin } = require("../auth");

const router = express.Router();


// POST /users/register - user registration 
router.post("/register", userController.registerUser);

// POST /users/login - user authentication
router.post("/login", userController.loginUser);

// GET /users/details - retrieve user details
router.get("/details", verify, userController.getProfile);

// PATCH /users/:id/set-as-admin - set a user as admin (Admin Only)
router.patch("/:id/set-as-admin", verify, verifyAdmin, userController.setAsAdmin);

// PATCH /users/update-password - to reset a user's password
router.patch("/update-password", verify, userController.resetPassword);


module.exports = router;