const express = require("express");
const movieController = require("../controllers/movie");

const { verify, verifyAdmin } = require("../auth");

const router = express.Router();

// POST /movies - Create a new movie (Admin only)
router.post("/", verify, verifyAdmin, movieController.addMovie);

// GET /movies - Retrieve all movies (Authenticated users)
router.get("/", verify, movieController.getAllMovies);

// GET /movies/:id - Retrieve a single movie by ID (Authenticated users)
router.get("/:id", verify, movieController.getMovieById);

// PATCH /movies/:id - Update a movie (Admin only)
router.patch("/:id", verify, verifyAdmin, movieController.updateMovie);

// DELETE /movies/:id - Delete a movie (Admin only)
router.delete("/:id", verify, verifyAdmin, movieController.deleteMovie);

// POST /movies/:id/comments - Add a comment to a movie (Authenticated users)
router.post("/:id/comments", verify, movieController.addComment);

// GET /movies/:id/comments - Get comments from a movie (Authenticated users)
router.get("/:id/comments", verify, movieController.getComments);

module.exports = router;