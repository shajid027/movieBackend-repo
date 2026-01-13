const express = require("express");
const router = express.Router();

const movieControllers = require("../controllers/movie.controller.js");

router.get("/all", movieControllers.getMovies);
router.get("/:id", movieControllers.getMovieDetails);

router.post("/create", movieControllers.createMovie);

router.put("/:movieId", movieControllers.updateMovies);

router.delete("/:movieId", movieControllers.deleteMovies);

module.exports = router;
