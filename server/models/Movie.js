const mongoose = require('mongoose');

// Comment subdocument schema
const commentSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   comment: {
      type: String,
      required: [true, 'Comment is required.'],
      trim: true,
      maxlength: [500, 'Comment cannot exceed 500 characters']
   },
   dateAdded: {
      type: Date,
      default: Date.now
   }
});

// Movie schema
const movieSchema = new mongoose.Schema({
   title: {
      type: String,
      required: [true, 'Title is required.'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
   },
   director: {
      type: String,
      required: [true, 'Director is required.'],
      trim: true,
      maxlength: [50, 'Director name cannot exceed 50 characters']
   },
   year: {
      type: Number,
      required: [true, 'Year is required.'],
      min: [1900, 'Year must be 1900 or later'],
      max: [new Date().getFullYear() + 5, 'Year cannot be more than 5 years in the future']
   },
   description: {
      type: String,
      required: [true, 'Description is required.'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
   },
   genre: {
      type: String,
      required: [true, 'Genre is required.'],
      trim: true,
      maxlength: [30, 'Genre cannot exceed 30 characters']
   },
   comments: [commentSchema]
}, {
   timestamps: true
});

module.exports = mongoose.model('Movie', movieSchema);