import { Movie, Rating, SvdModel, EpochMetric, MovieFactor2D } from "../types";
import { GENRES } from "./moviesData";

/**
 * Trains an SVD Matrix Factorization model using Stochastic Gradient Descent (SGD).
 * Predicts: r_hat = mu + bu + bi + P_u . Q_i
 */
export function trainSvdModel(
  movies: Movie[],
  ratings: Rating[],
  latentFactors = 5,
  epochs = 40,
  lr = 0.005,
  reg = 0.02
): SvdModel {
  // Compute global mean mu
  const totalRatingSum = ratings.reduce((sum, r) => sum + r.rating, 0);
  const mu = ratings.length > 0 ? totalRatingSum / ratings.length : 3.5;

  const P: Record<number, number[]> = {};
  const Q: Record<number, number[]> = {};
  const bu: Record<number, number> = {};
  const bi: Record<number, number> = {};

  // Random initialization helper
  const rand = () => (Math.random() - 0.5) * 0.15;

  // Gather unique users and movies
  const userIds = Array.from(new Set(ratings.map((r) => r.userId)));
  const movieIds = movies.map((m) => m.id);

  userIds.forEach((u) => {
    P[u] = Array.from({ length: latentFactors }, rand);
    bu[u] = 0;
  });

  movieIds.forEach((m) => {
    Q[m] = Array.from({ length: latentFactors }, rand);
    bi[m] = 0;
  });

  const rmseHistory: EpochMetric[] = [];

  for (let epoch = 1; epoch <= epochs; epoch++) {
    // Shuffle ratings for SGD to avoid local minima
    const shuffledRatings = [...ratings].sort(() => Math.random() - 0.5);
    let squaredErrorSum = 0;
    let absoluteErrorSum = 0;

    for (const r of shuffledRatings) {
      const u = r.userId;
      const i = r.movieId;

      if (!P[u]) {
        P[u] = Array.from({ length: latentFactors }, rand);
        bu[u] = 0;
      }
      if (!Q[i]) {
        Q[i] = Array.from({ length: latentFactors }, rand);
        bi[i] = 0;
      }

      // Compute dot product
      let dotProduct = 0;
      for (let f = 0; f < latentFactors; f++) {
        dotProduct += P[u][f] * Q[i][f];
      }

      const prediction = mu + bu[u] + bi[i] + dotProduct;
      const error = r.rating - prediction;

      squaredErrorSum += error * error;
      absoluteErrorSum += Math.abs(error);

      // Gradient descent step
      bu[u] += lr * (error - reg * bu[u]);
      bi[i] += lr * (error - reg * bi[i]);

      for (let f = 0; f < latentFactors; f++) {
        const p_uf = P[u][f];
        const q_if = Q[i][f];
        P[u][f] += lr * (error * q_if - reg * p_uf);
        Q[i][f] += lr * (error * p_uf - reg * q_if);
      }
    }

    const rmse = ratings.length > 0 ? Math.sqrt(squaredErrorSum / ratings.length) : 0;
    const mae = ratings.length > 0 ? absoluteErrorSum / ratings.length : 0;
    rmseHistory.push({ epoch, rmse, mae });
  }

  return { P, Q, bu, bi, mu, rmseHistory };
}

/**
 * Predicts a rating for a user and movie using SVD.
 */
export function predictRating(
  userId: number,
  movieId: number,
  model: SvdModel
): number {
  const { P, Q, bu, bi, mu } = model;
  const userBias = bu[userId] !== undefined ? bu[userId] : 0;
  const movieBias = bi[movieId] !== undefined ? bi[movieId] : 0;

  const userFactor = P[userId];
  const movieFactor = Q[movieId];

  let dotProduct = 0;
  if (userFactor && movieFactor) {
    const len = Math.min(userFactor.length, movieFactor.length);
    for (let f = 0; f < len; f++) {
      dotProduct += userFactor[f] * movieFactor[f];
    }
  }

  const prediction = mu + userBias + movieBias + dotProduct;
  // Clamp prediction to standard 1-5 stars
  return Math.max(1.0, Math.min(5.0, prediction));
}

/**
 * Computes the user's genre preference profile.
 * High ratings contribute positively; low ratings (under 2.5) act as negative affinities.
 */
export function computeUserGenreProfile(
  userId: number,
  ratings: Rating[],
  movies: Movie[]
): Record<string, number> {
  const profile: Record<string, number> = {};
  GENRES.forEach((g) => (profile[g] = 0));

  const userRatings = ratings.filter((r) => r.userId === userId);
  if (userRatings.length === 0) return profile;

  userRatings.forEach((r) => {
    const movie = movies.find((m) => m.id === r.movieId);
    if (!movie) return;

    // Weight is relative to neutral midpoint of 2.5
    const weight = r.rating - 2.5;
    movie.genres.forEach((g) => {
      if (profile[g] !== undefined) {
        profile[g] += weight;
      }
    });
  });

  return profile;
}

/**
 * Computes Cosine Similarity between a movie's genre vector and the user's affinity profile.
 * Normalizes values to a positive [0, 1] range.
 */
export function computeContentSimilarity(
  movieGenres: string[],
  userProfile: Record<string, number>
): number {
  let dotProduct = 0;
  let profileSumSq = 0;
  const movieSumSq = movieGenres.length;

  if (movieSumSq === 0) return 0;

  GENRES.forEach((g) => {
    const profileVal = userProfile[g] || 0;
    profileSumSq += profileVal * profileVal;

    if (movieGenres.includes(g)) {
      dotProduct += profileVal * 1; // Binary match multiplier
    }
  });

  if (profileSumSq === 0) return 0.5; // Neutral midpoint if user has no profiles yet

  const similarity = dotProduct / (Math.sqrt(profileSumSq) * Math.sqrt(movieSumSq));
  
  // Transform from [-1, 1] to [0, 1] range
  return Math.max(0, Math.min(1, (similarity + 1) / 2));
}

/**
 * Projects the movie factors Q from the SVD model onto a 2D space for visualization.
 */
export function getMovieFactors2D(
  movies: Movie[],
  model: SvdModel
): MovieFactor2D[] {
  const list: MovieFactor2D[] = [];
  
  movies.forEach((m) => {
    const factors = model.Q[m.id];
    if (factors && factors.length >= 2) {
      // Scale coordinates slightly for visibility
      let x = factors[0] * 12;
      let y = factors[1] * 12;
      
      // Prevent absolute zero clustering
      if (Math.abs(x) < 0.01 && Math.abs(y) < 0.01) {
        x = (Math.sin(m.id * 1.5) * 5);
        y = (Math.cos(m.id * 1.5) * 5);
      }
      
      list.push({
        movieId: m.id,
        title: m.title,
        x,
        y,
        genres: m.genres
      });
    } else {
      // Fallback pseudo-latent coordinate using ID
      list.push({
        movieId: m.id,
        title: m.title,
        x: (Math.sin(m.id * 1.5) * 5),
        y: (Math.cos(m.id * 1.5) * 5),
        genres: m.genres
      });
    }
  });

  return list;
}
