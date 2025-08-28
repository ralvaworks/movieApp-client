const Movie = require("../models/Movie");
const { errorHandler } = require("../auth");

// POST /movies - Create a new movie (Authenticated users)
module.exports.addMovie = async (req, res) => {
   try {
      const { title, director, year, description, genre } = req.body;

      // Validation
      if (!title || !director || !year || !description || !genre) {
         return res.status(400).json({ 
            error: "All fields are required",
            details: "title, director, year, description, and genre are required fields"
         });
      }

      const newMovie = new Movie({
         title,
         director,
         year,
         description,
         genre
      });

      await newMovie.save();
      return res.status(201).json({ 
         message: 'Movie added successfully',
         movie: newMovie
      });

   } catch (error) {
      // Handle Mongoose validation errors
      if (error.name === 'ValidationError') {
         const messages = Object.values(error.errors).map(val => val.message);
         return res.status(400).json({
            error: "Validation Error",
            details: messages
         });
      }

      return errorHandler(error, req, res);
   }
};

// GET /movies - Retrieve all movies (Authenticated users)
module.exports.getAllMovies = async (req, res) => {
   try {
      const movies = await Movie.find({}).populate('comments.userId', 'firstName lastName email');
      
      return res.status(200).json({
         message: 'Movies retrieved successfully',
         movies: movies
      });

   } catch (error) {
      return errorHandler(error, req, res);
   }
};

// GET /movies/:id - Retrieve a single movie by ID (Authenticated users)
module.exports.getMovieById = async (req, res) => {
   try {
      const movie = await Movie.findById(req.params.id).populate('comments.userId', 'firstName lastName email');

      if (!movie) {
         return res.status(404).json({ error: "Movie not found" });
      }

      return res.status(200).json({
         message: 'Movie retrieved successfully',
         movie: movie
      });

   } catch (error) {
      // Handle invalid ObjectId error
      if (error.name === 'CastError') {
         return res.status(400).json({ error: "Invalid movie ID format" });
      }

      return errorHandler(error, req, res);
   }
};

// PATCH /movies/:id - Update a movie (Admin only)
module.exports.updateMovie = async (req, res) => {
   try {
      const { title, director, year, description, genre } = req.body;
      
      // Build update object with only provided fields
      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (director !== undefined) updateData.director = director;
      if (year !== undefined) updateData.year = year;
      if (description !== undefined) updateData.description = description;
      if (genre !== undefined) updateData.genre = genre;

      if (Object.keys(updateData).length === 0) {
         return res.status(400).json({ 
            error: "No valid fields to update",
            details: "At least one field (title, director, year, description, genre) must be provided"
         });
      }

      const updatedMovie = await Movie.findByIdAndUpdate(
         req.params.id,
         updateData,
         { new: true, runValidators: true }
      ).populate('comments.userId', 'firstName lastName email');

      if (!updatedMovie) {
         return res.status(404).json({ error: "Movie not found" });
      }

      return res.status(200).json({
         message: 'Movie updated successfully',
         updatedMovie: updatedMovie
      });

   } catch (error) {
      // Handle invalid ObjectId error
      if (error.name === 'CastError') {
         return res.status(400).json({ error: "Invalid movie ID format" });
      }

      // Handle Mongoose validation errors
      if (error.name === 'ValidationError') {
         const messages = Object.values(error.errors).map(val => val.message);
         return res.status(400).json({
            error: "Validation Error",
            details: messages
         });
      }

      return errorHandler(error, req, res);
   }
};

// DELETE /movies/:id - Delete a movie (Admin only)
module.exports.deleteMovie = async (req, res) => {
   try {
      const deletedMovie = await Movie.findByIdAndDelete(req.params.id);

      if (!deletedMovie) {
         return res.status(404).json({ error: "Movie not found" });
      }

      return res.status(200).json({
         message: 'Movie deleted successfully'
      });

   } catch (error) {
      // Handle invalid ObjectId error
      if (error.name === 'CastError') {
         return res.status(400).json({ error: "Invalid movie ID format" });
      }

      return errorHandler(error, req, res);
   }
};

// POST /movies/:id/comments - Add a comment to a movie (Authenticated users)
module.exports.addComment = async (req, res) => {
   try {
      const { comment } = req.body;

      if (!comment || comment.trim() === '') {
         return res.status(400).json({ 
            error: "Comment is required",
            details: "Comment field cannot be empty"
         });
      }

      const movie = await Movie.findById(req.params.id);

      if (!movie) {
         return res.status(404).json({ error: "Movie not found" });
      }

      const newComment = {
         userId: req.user.id,
         comment: comment.trim()
      };

      movie.comments.push(newComment);
      await movie.save();

      // Populate the new comment with user details
      await movie.populate('comments.userId', 'firstName lastName email');

      return res.status(201).json({
         message: 'Comment added successfully',
         updatedMovie: movie.comments[movie.comments.length - 1]
      });

   } catch (error) {
      // Handle invalid ObjectId error
      if (error.name === 'CastError') {
         return res.status(400).json({ error: "Invalid movie ID format" });
      }

      // Handle Mongoose validation errors
      if (error.name === 'ValidationError') {
         const messages = Object.values(error.errors).map(val => val.message);
         return res.status(400).json({
            error: "Validation Error",
            details: messages
         });
      }

      return errorHandler(error, req, res);
   }
};

// GET /movies/:id/comments - Get comments from a movie (Authenticated users)
module.exports.getComments = async (req, res) => {
   try {
      const movie = await Movie.findById(req.params.id).populate('comments.userId', 'firstName lastName email');

      if (!movie) {
         return res.status(404).json({ error: "Movie not found" });
      }

      return res.status(200).json({
         message: 'Comments retrieved successfully',
         comments: movie.comments
      });

   } catch (error) {
      // Handle invalid ObjectId error
      if (error.name === 'CastError') {
         return res.status(400).json({ error: "Invalid movie ID format" });
      }

      return errorHandler(error, req, res);
   }
};