export interface Movie {
  id: number;
  title: string;
  genres: string[];
  releaseYear: number;
  overview: string;
  coverUrl: string;
  backdropUrl: string;
  averageRating: number;
  voteCount: number;
}

export interface Rating {
  userId: number;
  movieId: number;
  rating: number;
}

export interface User {
  id: number;
  name: string;
  avatar: string;
}

export interface Recommendation {
  movie: Movie;
  predictedRating: number;      // Collaborative score [1, 5]
  contentSimilarityScore: number; // Content similarity [0, 1]
  hybridScore: number;            // Blended score [0, 100] or normalized [0, 1]
}

export interface EpochMetric {
  epoch: number;
  rmse: number;
  mae: number;
}

export interface SvdModel {
  P: Record<number, number[]>; // userId -> factor array
  Q: Record<number, number[]>; // movieId -> factor array
  bu: Record<number, number>;  // user biases
  bi: Record<number, number>;  // movie biases
  mu: number;                  // global mean
  rmseHistory: EpochMetric[];
}

export interface UserRatingDistribution {
  rating: number;
  count: number;
}

export interface UserGenreAffinity {
  genre: string;
  score: number;
}

export interface MovieFactor2D {
  movieId: number;
  title: string;
  x: number;
  y: number;
  genres: string[];
}
