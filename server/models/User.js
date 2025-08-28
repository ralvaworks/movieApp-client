const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
   firstName: {
      type: String,
      required: [true, 'First name is required.'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters long'],
      maxlength: [50, 'First name cannot exceed 50 characters']
   },
   lastName: {
      type: String,
      required: [true, 'Last name is required.'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters long'],
      maxlength: [50, 'Last name cannot exceed 50 characters']
   },
   email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email Invalid']
   },
   password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: [8, 'Password must be at least 8 characters.'],
      select: false
   },
   isAdmin: {
      type: Boolean,
      default: false
   },
   mobileNo: {
      type: String,
      required: false, // Made optional for simple registration
      trim: true,
      match: [/^[0-9]{10,15}$/, 'Mobile number invalid'],
      minlength: [10, "Mobile number must be at least 10 digits."],
      maxlength: [15, "Mobile number must not be more than 15 digits."]
   }
});




module.exports = mongoose.model('User', userSchema);