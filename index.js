require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth.route.js');
const movieRouter = require('./routes/movie.route.js');
const connectDB = require('./utils/db.js');
const errorMiddleware = require('./middlewares/error.middleware.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/movies', movieRouter);

// Global error handler
app.use(errorMiddleware);

const PORT = process.env.PORT || 8000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
