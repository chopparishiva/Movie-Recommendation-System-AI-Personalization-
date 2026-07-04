import React, { useState } from "react";
import { Movie } from "../types";
import { Star, Film, Award, Hash, BookOpen } from "lucide-react";

interface MovieCardProps {
  key?: React.Key | number;
  movie: Movie;
  userRating?: number;
  onRate?: (rating: number) => void;
  predictedRating?: number;
  contentSimilarityScore?: number;
  hybridScore?: number;
  showMetrics?: boolean;
}

export default function MovieCard({
  movie,
  userRating,
  onRate,
  predictedRating,
  contentSimilarityScore,
  hybridScore,
  showMetrics = false
}: MovieCardProps) {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  return (
    <div 
      id={`movie-card-${movie.id}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-neutral-900 border border-neutral-800 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-950/25"
    >
      {/* Cover Backdrop */}
      <div className="relative h-48 overflow-hidden bg-neutral-950">
        <img
          src={movie.coverUrl}
          alt={movie.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
        />
        
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-black/40" />

        {/* Badge: Hybrid Score or Release Year */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
          <span className="rounded-full bg-neutral-950/80 px-2.5 py-0.5 text-xs font-semibold text-neutral-300 backdrop-blur-md border border-neutral-800">
            {movie.releaseYear}
          </span>
          {showMetrics && hybridScore !== undefined && (
            <div className="flex items-center gap-1 rounded-full bg-indigo-600 px-2.5 py-1 text-xs font-bold text-white shadow-md shadow-indigo-950/50 animate-pulse">
              <Award className="h-3.5 w-3.5" />
              <span>{hybridScore.toFixed(0)}% Match</span>
            </div>
          )}
        </div>

        {/* Average Rating Star Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-md bg-neutral-950/75 px-2 py-0.5 text-xs font-medium text-amber-400 backdrop-blur-md border border-neutral-800">
          <Star className="h-3 w-3 fill-amber-400" />
          <span>{movie.averageRating.toFixed(1)}</span>
          <span className="text-neutral-500">({movie.voteCount})</span>
        </div>
      </div>

      {/* Contents */}
      <div className="flex flex-1 flex-col p-5">
        {/* Genres badges */}
        <div className="mb-2.5 flex flex-wrap gap-1">
          {movie.genres.map((g) => (
            <span 
              key={g} 
              className="rounded-lg bg-neutral-950/60 px-2 py-0.5 text-[10px] font-semibold text-neutral-400 border border-neutral-800/80"
            >
              {g}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="line-clamp-1 font-sans text-base font-bold text-neutral-100 group-hover:text-indigo-400 transition-colors">
          {movie.title}
        </h3>

        {/* Overview */}
        <p className="mt-1.5 line-clamp-3 text-xs text-neutral-400 leading-relaxed flex-1">
          {movie.overview}
        </p>

        {/* Algorithmic breakdown */}
        {showMetrics && (predictedRating !== undefined || contentSimilarityScore !== undefined) && (
          <div className="mt-3.5 rounded-2xl bg-neutral-950 p-3 border border-neutral-800/80 text-[11px] space-y-1.5 font-mono text-neutral-400">
            {predictedRating !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 flex items-center gap-1">
                  <Star className="h-3 w-3 text-emerald-400" />
                  SVD Predicted Rating:
                </span>
                <span className="font-bold text-emerald-400">{predictedRating.toFixed(2)} ★</span>
              </div>
            )}
            {contentSimilarityScore !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 flex items-center gap-1">
                  <Film className="h-3 w-3 text-purple-400" />
                  Genre Similarity:
                </span>
                <span className="font-bold text-purple-400">{(contentSimilarityScore * 100).toFixed(0)}%</span>
              </div>
            )}
          </div>
        )}

        {/* User rating interaction */}
        <div className="mt-4 border-t border-neutral-800/80 pt-3 flex items-center justify-between">
          <span className="text-xs text-neutral-400 font-semibold">Your Rating:</span>
          
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => {
              const isFilled = hoveredStar !== null ? star <= hoveredStar : (userRating !== undefined && star <= userRating);
              return (
                <button
                  key={star}
                  onClick={() => onRate && onRate(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(null)}
                  className="p-0.5 text-neutral-600 transition-transform active:scale-125 hover:text-indigo-400"
                  title={`Rate ${star} star${star > 1 ? "s" : ""}`}
                >
                  <Star 
                    className={`h-4.5 w-4.5 transition-colors ${
                      isFilled ? "fill-indigo-500 text-indigo-500" : "text-neutral-600 hover:text-indigo-400"
                    }`} 
                  />
                </button>
              );
            })}
            {userRating !== undefined && (
              <button
                onClick={() => onRate && onRate(0)}
                className="ml-2 text-[10px] font-mono font-semibold text-rose-400 hover:underline px-2 py-0.5 rounded-lg bg-rose-950/20 border border-rose-500/10 transition-colors"
                title="Clear rating"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
