require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const Movies = require('./movies-data-small.json');

console.log(process.env.API_TOKEN);

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');
  console.log('validate bearer token middleware');

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  // move to the next middleware
  next();
});

// Bring up the Movies Json file
function handleGetMovies(req, res) {
  let movies = Movies;
  // Search by Genre
  if (req.query.genre) {
    movies = movies.filter(
      (movie) => req.query.genre.toLowerCase() === movie.genre.toLowerCase()
    );
  }
  // Search by Country
  if (req.query.country) {
    movies = movies.filter(
      (movie) => req.query.country.toLowerCase() === movie.country.toLowerCase()
    );
  }

  // Search by Avg_vote
  if (req.query.avg_vote) {
    movies = movies.filter(
      (movie) => Number(movie.avg_vote) >= Number(req.query.avg_vote)
    );
  }

  res.json(movies);
  console.log(req.query);
}

app.get('/movie', handleGetMovies);

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
