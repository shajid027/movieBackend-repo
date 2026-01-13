const Movie = require("../models/movie.model.js");

const createMovie = async (req, res) => {
  try {
    const movie = await Movie.create({
      ...req.body,
      createdBy: req.user._id,
    });
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMovies = async (req, res) => {
  try {
    const {
      search,
      genres,
      minRating,
      maxRating,
      yearFrom,
      yearTo,
      sort = "latest",
      page = 1,
      limit = 5,
    } = req.query;

    const query = {};

    if (search) query.title = { $regex: search, $options: "i" };
    if (genres) query.genre = { $in: genres.split(",") };

    if (minRating || maxRating) query.rating = {};
    if (minRating) query.rating.$gte = Number(minRating);
    if (maxRating) query.rating.$lte = Number(maxRating);

    if (yearFrom || yearTo) query.releaseYear = {};
    if (yearFrom) query.releaseYear.$gte = Number(yearFrom);
    if (yearTo) query.releaseYear.$lte = Number(yearTo);

    let sortOption = {};
    if (sort === "rating_high") sortOption = { rating: -1 };
    else if (sort === "rating_low") sortOption = { rating: 1 };
    else if (sort === "title_asc") sortOption = { title: 1 };
    else if (sort === "title_desc") sortOption = { title: -1 };
    else sortOption = { createdAt: -1 };

    const skip = (page - 1) * limit;

    const movies = await Movie.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Movie.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      movies,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMovieDetails = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMovies = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    movie.title = req.body.title || movie.title;
    movie.genre = req.body.genre || movie.genre;
    movie.releaseYear = req.body.releaseYear || movie.releaseYear;
    movie.rating = req.body.rating || movie.rating;

    const updatedMovie = await movie.save();

    res.status(200).json({
      success: true,
      message: "Movie updated successfully",
      movie: updatedMovie,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteMovies = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json({ success: true, message: "Movie deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMovie,
  getMovies,
  getMovieDetails,
  updateMovies,
  deleteMovies,
};
