const User = require("../models/User");
const bcrypt = require("bcrypt");
const auth = require("../auth");

const { errorHandler } = auth;


// POST /users/register - user registration
module.exports.registerUser = async (req, res) => {

   try {
      const { firstName, lastName, email, password, mobileNo } = req.body;

      // Basic validation - only require 3 fields: firstName, lastName, email, password
      if (!firstName || !lastName || !email || !password) {
         return res.status(400).json({ error: "First name, last name, email, and password are required." });
      }

      if (!email.includes("@")) {
         return res.status(400).json({ error: "Email Invalid" });
      }

      if (password.length < 8) {
         return res.status(400).json({ error: "Password must be at least 8 characters." });
      }

      // Validate mobile number only if provided
      if (mobileNo && (typeof mobileNo !== "string" || !(mobileNo.length >= 10 && mobileNo.length <= 15))) {
         return res.status(400).json({ error: "Mobile number invalid" });
      }

      const userData = {
         firstName,
         lastName,
         email,
         password: bcrypt.hashSync(password, 10)
      };

      // Only add mobileNo if provided
      if (mobileNo) {
         userData.mobileNo = mobileNo;
      }

      const newUser = new User(userData);

      await newUser.save();
      return res.status(201).json({ message: 'Registered Successfully' });  // ok created for successful user registration

   } catch (error) {
      // Handle duplicate email error (MongoDB error code 11000)
      if (error.code === 11000) {
         return res.status(409).json({ error: 'Email already exists.' }); // conflict for duplicate email
      }

      // Handle Mongoose validation errors
      if (error.name === 'ValidationError') {
         const messages = Object.values(error.errors).map(val => val.message);
         return res.status(400).json({
            error: "Validation Error",
            details: messages
         });
      }

      // Use the generic error handler for all other errors
      return errorHandler(error, req, res);

   }
};


// POST /users/login - user authentication
module.exports.loginUser = async (req, res) => {
   if (!req.body.email.includes("@")) {
      return res.status(400).json({ error: "Invalid Email" });  // bad request
   }

   try {
      const user = await User.findOne({ email: req.body.email }).select('+password');

      if (!user) {
         return res.status(404).json({ error: "No Email Found" });  // not found
      }

      const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);

      if (isPasswordCorrect) {
         return res.status(200).json({ 
            access: auth.createAccessToken(user),
            user: {
               _id: user._id,
               firstName: user.firstName,
               lastName: user.lastName,
               email: user.email,
               isAdmin: user.isAdmin
            }
         });  // ok for successful login
      } else {
         return res.status(401).json({ error: "Email and password do not match" });  // unauthorized for invalid creds
      }

   } catch (error) {
      return errorHandler(error, req, res);
   }
};


// POST /users/details - retrieve user details
module.exports.getProfile = async (req, res) => {

   try {
      const user = await User.findById(req.user.id);

      if (!user) {
         return res.status(404).json({ error: "User not found" });  // not found
      }
      return res.status(200).json({ user: user });  // ok for successful retrieval

   } catch (error) {
      return errorHandler(error, req, res);
   }
};


// PATCH /users/:id/set-as-admin - set a user as admin (Admin Only)
module.exports.setAsAdmin = async (req, res) => {
   try {

      const { id } = req.params; // Get user ID from the URL parameter

      const userToUpdate = await User.findById(id);

      if (!userToUpdate) {
         return res.status(404).json({ error: "User not found." });  // not found
      }

      // Check if the user is already an admin
      if (userToUpdate.isAdmin) {
         return res.status(200).json({ error: "User is already an admin." });
         // return res.status(400).send({ 
         //    success: false, 
         //    message: "User is already an admin." 
         // });
      }

      // Update the user to admin status
      const updatedUser = await User.findByIdAndUpdate(
         id, { isAdmin: true }, { new: true }
      ).select('+password');  // include password in the response

      return res.status(200).json({ updatedUser: updatedUser });  
      // .json({ message: "User successfully promoted to admin.",})

   } catch (error) {
      // Handle cases where the provided ID is not a valid MongoDB ObjectId
      if (error.name === 'CastError') {
         return res.status(500).json({ error: 'Failed in Find', details: error });
         // return res.status(400).json({ error: 'Invalid User ID Format' });
      }
      // Use the generic error handler for all other server-side errors
      return errorHandler(error, req, res);
   }
};


// PATCH /users/update-password - to reset a user's password
module.exports.resetPassword = async (req, res) => {
   try {
      // const userId = req.user.id; // assumes verify middleware attaches the decoded token to req.user
      const { id: userId } = req.user;
      const { newPassword } = req.body;

      // Add more robust validation to match the schema
      if (!newPassword || newPassword.length < 8) {
         return res.status(400).json({ message: "Password is required and must be at least 8 characters long." });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updatedUser = await User.findByIdAndUpdate(
         userId,
         { password: hashedPassword }
         // { new: true }
      );

      if (!updatedUser) {
         return res.status(404).json({ message: "User not found." });
      }

      return res.status(200).json({ message: "Password reset successfully." });  // ok for password reset
   } catch (error) {
      // console.error("Password reset error:", error);
      // res.status(500).json({ message: "Internal server error." });
      return errorHandler(error, req, res);
   }
};