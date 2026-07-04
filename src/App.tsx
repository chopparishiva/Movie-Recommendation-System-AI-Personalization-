import React, { useState, useMemo } from "react";
import { 
  Film, 
  Sliders, 
  UserCheck, 
  RefreshCw, 
  Sparkles, 
  Settings, 
  Info, 
  Tv, 
  TrendingUp, 
  Compass, 
  HelpCircle,
  Database,
  BarChart3
} from "lucide-react";

import { Movie, Rating, User } from "./types";
import { INITIAL_MOVIES, PRESEEDED_USERS, PRESEEDED_RATINGS, GENRES } from "./data/moviesData";
import { 
  trainSvdModel, 
  predictRating, 
  computeUserGenreProfile, 
  computeContentSimilarity, 
  getMovieFactors2D 
} from "./data/recommenderEngine";

import MovieCard from "./components/MovieCard";
import SvdDashboard from "./components/SvdDashboard";
import CinephileOracle from "./components/CinephileOracle";

const DEFAULT_USER_100_RATINGS: Rating[] = [
  { userId: 100, movieId: 5, rating: 5 }, // Pulp Fiction (Drama/Thriller/Comedy)
  { userId: 100, movieId: 1, rating: 4 }, // Toy Story (Animation/Adventure)
  { userId: 100, movieId: 3, rating: 1 }, // Titanic (Drama/Romance)
  { userId: 100, movieId: 2, rating: 5 }, // The Matrix (Action/Sci-Fi)
  { userId: 100, movieId: 6, rating: 4 }, // The Dark Knight (Action/Drama)
];

const INITIAL_RATINGS_DATASET = [
  ...PRESEEDED_RATINGS,
  ...DEFAULT_USER_100_RATINGS
];

export default function App() {
  // Recommendation settings
  const [selectedUserId, setSelectedUserId] = useState<number>(100);
  const [hybridWeight, setHybridWeight] = useState<number>(50); // 0 = Content, 100 = Collaborative SVD
  const [ratings, setRatings] = useState<Rating[]>(INITIAL_RATINGS_DATASET);

  // Hyperparameters
  const [latentFactors, setLatentFactors] = useState<number>(5);
  const [epochs, setEpochs] = useState<number>(40);
  const [learningRate, setLearningRate] = useState<number>(0.005);
  const [regularization, setRegularization] = useState<number>(0.02);

  // Filter/Search settings for catalogue
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  // Visual Tabs
  const [activeTab, setActiveTab] = useState<"recommendations" | "analytics">("recommendations");
  const [showSettings, setShowSettings] = useState(false);
  const [retrainFlash, setRetrainFlash] = useState(false);

  // Create User List (Adding custom "You" user)
  const usersList = useMemo<User[]>(() => {
    return [
      ...PRESEEDED_USERS,
      { id: 100, name: "You (Custom Profile)", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" }
    ];
  }, []);

  const selectedUser = useMemo(() => {
    return usersList.find((u) => u.id === selectedUserId) || usersList[usersList.length - 1];
  }, [selectedUserId, usersList]);

  // Train the SVD Model on current ratings
  const svdModel = useMemo(() => {
    const model = trainSvdModel(INITIAL_MOVIES, ratings, latentFactors, epochs, learningRate, regularization);
    
    // Trigger quick retrain visual confirmation
    setRetrainFlash(true);
    const t = setTimeout(() => setRetrainFlash(false), 800);
    return model;
  }, [ratings, latentFactors, epochs, learningRate, regularization]);

  // Compute recommendation metrics for all movies for the current user
  const movieRecommendations = useMemo(() => {
    const userProfile = computeUserGenreProfile(selectedUserId, ratings, INITIAL_MOVIES);
    const userRatedIds = new Set(
      ratings.filter((r) => r.userId === selectedUserId).map((r) => r.movieId)
    );

    return INITIAL_MOVIES.map((movie) => {
      const userRatingRecord = ratings.find((r) => r.userId === selectedUserId && r.movieId === movie.id);
      const userRating = userRatingRecord?.rating;
      const isRated = userRating !== undefined;

      const predictedRating = predictRating(selectedUserId, movie.id, svdModel);
      const contentSimilarityScore = computeContentSimilarity(movie.genres, userProfile);
      
      // Normalize SVD to a 0-1 scale
      const normSvd = (predictedRating - 1) / 4;
      const alpha = hybridWeight / 100;
      
      // Blend into [0, 100] percentage score
      const hybridScore = (alpha * normSvd + (1 - alpha) * contentSimilarityScore) * 100;

      return {
        movie,
        predictedRating,
        contentSimilarityScore,
        hybridScore,
        isRated,
        userRating
      };
    });
  }, [ratings, selectedUserId, svdModel, hybridWeight]);

  // Top unrated recommendations for primary showcase
  const topPersonalRecs = useMemo(() => {
    return movieRecommendations
      .filter((rec) => !rec.isRated)
      .sort((a, b) => b.hybridScore - a.hybridScore)
      .slice(0, 4); // Top 4 recommendations
  }, [movieRecommendations]);

  // Ratings distribution for dashboard
  const ratingsDistribution = useMemo(() => {
    const userRatings = ratings.filter((r) => r.userId === selectedUserId);
    const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    userRatings.forEach((r) => {
      if (dist[r.rating] !== undefined) {
        dist[r.rating]++;
      }
    });
    return Object.keys(dist).map((key) => ({
      rating: parseInt(key),
      count: dist[parseInt(key)]
    }));
  }, [ratings, selectedUserId]);

  // Genre affinity profile values
  const genreAffinities = useMemo(() => {
    const profile = computeUserGenreProfile(selectedUserId, ratings, INITIAL_MOVIES);
    return Object.keys(profile).map((key) => ({
      genre: key,
      score: profile[key]
    })).sort((a, b) => b.score - a.score);
  }, [ratings, selectedUserId]);

  // Latent Factors 2D projection
  const movieFactors2D = useMemo(() => {
    return getMovieFactors2D(INITIAL_MOVIES, svdModel);
  }, [svdModel]);

  // Handle movie rating input
  const handleRateMovie = (movieId: number, rating: number) => {
    setRatings((prev) => {
      // Clean previous rating if rating is 0
      if (rating === 0) {
        return prev.filter((r) => !(r.userId === selectedUserId && r.movieId === movieId));
      }
      
      const exists = prev.some((r) => r.userId === selectedUserId && r.movieId === movieId);
      if (exists) {
        return prev.map((r) => 
          r.userId === selectedUserId && r.movieId === movieId ? { ...r, rating } : r
        );
      } else {
        return [...prev, { userId: selectedUserId, movieId, rating }];
      }
    });
  };

  // Reset helper
  const handleResetRatings = () => {
    setRatings(INITIAL_RATINGS_DATASET);
    setLatentFactors(5);
    setEpochs(40);
    setLearningRate(0.005);
    setRegularization(0.02);
    setHybridWeight(50);
  };

  // Filter movie catalogue list
  const filteredCatalogue = useMemo(() => {
    return movieRecommendations.filter((rec) => {
      const matchesSearch = rec.movie.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            rec.movie.genres.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesGenre = selectedGenre === "All" || rec.movie.genres.includes(selectedGenre);
      return matchesSearch && matchesGenre;
    });
  }, [movieRecommendations, searchQuery, selectedGenre]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans" id="netflix-rec-system-root">
      
      {/* Decorative ambient blobs */}
      <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-indigo-950/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 h-96 w-96 rounded-full bg-purple-950/15 blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="mx-auto max-w-[1550px] px-6 py-8">
        
        {/* Header Block */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between border-b border-neutral-800 pb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-neutral-100 shadow-lg shadow-indigo-950/40">
              <Film className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-sans text-2xl font-black tracking-tight text-neutral-100">
                CINE<span className="text-indigo-500">MATCH</span> STUDIO
              </h1>
              <p className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest mt-0.5">
                Enterprise MovieLens AI Personalization Engine
              </p>
            </div>
          </div>

          {/* User Profile Selector & Reset */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Active User selector */}
            <div className="flex items-center gap-2 rounded-full bg-neutral-900 border border-neutral-800 p-1.5 px-4 shadow-sm">
              <UserCheck className="h-4 w-4 text-indigo-400" />
              <label className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-wider mr-1">
                Profile:
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(parseInt(e.target.value))}
                className="bg-transparent text-xs font-semibold text-neutral-200 outline-none cursor-pointer pr-4 hover:text-indigo-400 transition-colors"
              >
                {usersList.map((u) => (
                  <option key={u.id} value={u.id} className="bg-neutral-900 text-neutral-100 text-xs">
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset */}
            <button
              onClick={handleResetRatings}
              className="flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 px-4 py-1.5 text-xs font-semibold text-neutral-400 hover:text-neutral-200 transition-all active:scale-95"
              title="Reset ratings to default pre-seeded dataset"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset Engine
            </button>
            
            {/* Indicator of SVD Retraining */}
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-mono border transition-all duration-300 ${
              retrainFlash 
                ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30 scale-105" 
                : "bg-neutral-900/60 text-neutral-500 border-neutral-800/80"
            }`}>
              <Database className="h-3 w-3" />
              SVD Matrix Recomputed
            </span>

          </div>
        </header>

        {/* Dynamic High-Level Stat Cards Row */}
        <section className="mb-8 grid grid-cols-2 lg:grid-cols-4 gap-4" id="stats-dashboard-row">
          
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/80 p-6 flex items-center gap-4 relative overflow-hidden group hover:border-neutral-700 transition-all duration-300 shadow-md shadow-black/10">
            <div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-400 border border-indigo-500/15">
              <Tv className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-semibold">Cine Lens Movies</p>
              <p className="text-2xl font-black text-white mt-0.5">{INITIAL_MOVIES.length}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/80 p-6 flex items-center gap-4 relative overflow-hidden group hover:border-neutral-700 transition-all duration-300 shadow-md shadow-black/10">
            <div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-400 border border-indigo-500/15">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-semibold">Dataset Ratings</p>
              <p className="text-2xl font-black text-white mt-0.5">{ratings.length} values</p>
            </div>
          </div>

          <div className="rounded-3xl bg-indigo-600 p-6 flex items-center gap-4 text-white relative overflow-hidden group shadow-lg shadow-indigo-900/20 hover:bg-indigo-700 transition-all duration-300">
            <div className="rounded-2xl bg-white/10 p-3 text-white border border-white/20">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-indigo-200 uppercase tracking-widest font-bold">Latent Dimensions</p>
              <p className="text-2xl font-black text-white mt-0.5">{latentFactors} factors</p>
            </div>
          </div>

          <div className="rounded-3xl bg-emerald-500 text-neutral-950 p-6 flex items-center gap-4 relative overflow-hidden group hover:bg-emerald-400 transition-all duration-300">
            <div className="rounded-2xl bg-neutral-950/10 p-3 text-neutral-950 border border-neutral-950/10">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-emerald-950/80 uppercase tracking-widest font-bold">Converged RMSE</p>
              <p className="text-2xl font-black text-neutral-950 mt-0.5">
                {svdModel.rmseHistory[svdModel.rmseHistory.length - 1]?.rmse.toFixed(4) || "0.0000"}
              </p>
            </div>
          </div>

        </section>

        {/* Main Grid Layout: left dashboard controls & listings (8 cols) vs right Gemini advisor (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Dashboard and Film lists */}
          <main className="lg:col-span-8 flex flex-col gap-6">

            {/* Hybrid Slider Control Panel */}
            <section className="rounded-3xl border border-neutral-800 bg-neutral-900/80 p-6 relative overflow-hidden shadow-md shadow-black/10">
              <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-indigo-500" />
                  <h2 className="text-base font-bold text-neutral-100">Hybrid Recommendation Blending</h2>
                </div>
                
                {/* Advanced Hyperparameter toggle */}
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`flex items-center gap-1.5 text-[11px] font-mono px-3 py-1.5 rounded-xl border transition-all ${
                    showSettings 
                      ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400" 
                      : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  <Settings className="h-3.5 w-3.5" />
                  {showSettings ? "Hide Algorithm Tuning" : "Tweak SVD Hyperparameters"}
                </button>
              </div>

              <p className="text-xs text-neutral-400 mb-5 leading-relaxed">
                Determine the mathematical blend of your recommendation engine. Move the slider to shift between **Content-Based Filtering** (matching genres directly to your ratings) and **Collaborative SVD Filtering** (discovering deeper hidden rating patterns from other similar users).
              </p>

              {/* Slider UI */}
              <div className="space-y-3.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-xl border transition-all ${hybridWeight === 0 ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 font-bold" : "text-neutral-500 border-transparent"}`}>
                    Genre-Based Content ({(100 - hybridWeight)}%)
                  </span>
                  <span className="text-indigo-400 font-bold text-xs bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
                    Ratio {100 - hybridWeight} : {hybridWeight}
                  </span>
                  <span className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-xl border transition-all ${hybridWeight === 100 ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 font-bold" : "text-neutral-500 border-transparent"}`}>
                    Collaborative SVD ({hybridWeight}%)
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={hybridWeight}
                    onChange={(e) => setHybridWeight(parseInt(e.target.value))}
                    className="w-full h-2 rounded-lg bg-neutral-800 appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
                    style={{
                      background: `linear-gradient(to right, rgb(99, 102, 241) ${hybridWeight}%, rgb(38, 38, 38) ${hybridWeight}%)`
                    }}
                  />
                </div>
              </div>

              {/* Collapsible Sandbox Hyperparameter Settings */}
              {showSettings && (
                <div className="mt-5 border-t border-neutral-800 pt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                  
                  {/* SVD latent factors */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-neutral-400">
                      <span>Latent Factors (k)</span>
                      <span className="text-indigo-400 font-bold">{latentFactors}</span>
                    </div>
                    <input 
                      type="range" min="2" max="10" value={latentFactors} 
                      onChange={(e) => setLatentFactors(parseInt(e.target.value))}
                      className="w-full accent-indigo-500 bg-neutral-950 h-1.5 rounded-lg"
                    />
                    <p className="text-[10px] text-neutral-500">Decomposition size of matrices P & Q.</p>
                  </div>

                  {/* Epochs */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-neutral-400">
                      <span>GD Epochs</span>
                      <span className="text-indigo-400 font-bold">{epochs}</span>
                    </div>
                    <input 
                      type="range" min="10" max="80" step="5" value={epochs} 
                      onChange={(e) => setEpochs(parseInt(e.target.value))}
                      className="w-full accent-indigo-500 bg-neutral-950 h-1.5 rounded-lg"
                    />
                    <p className="text-[10px] text-neutral-500">Stochastic GD iterations.</p>
                  </div>

                  {/* Learning rate */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-neutral-400">
                      <span>Learning Rate (γ)</span>
                      <span className="text-indigo-400 font-bold">{learningRate}</span>
                    </div>
                    <input 
                      type="range" min="0.001" max="0.03" step="0.001" value={learningRate} 
                      onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                      className="w-full accent-indigo-500 bg-neutral-950 h-1.5 rounded-lg"
                    />
                    <p className="text-[10px] text-neutral-500">SGD step size coefficient.</p>
                  </div>

                  {/* Regularization */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-neutral-400">
                      <span>Regularization (λ)</span>
                      <span className="text-indigo-400 font-bold">{regularization}</span>
                    </div>
                    <input 
                      type="range" min="0.01" max="0.1" step="0.01" value={regularization} 
                      onChange={(e) => setRegularization(parseFloat(e.target.value))}
                      className="w-full accent-indigo-500 bg-neutral-950 h-1.5 rounded-lg"
                    />
                    <p className="text-[10px] text-neutral-500">Regularization to prevent overfitting.</p>
                  </div>

                </div>
              )}
            </section>

            {/* View Switch Tabs */}
            <div className="flex border border-neutral-800 bg-neutral-900/40 p-1.5 rounded-2xl shadow-inner">
              <button
                onClick={() => setActiveTab("recommendations")}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "recommendations" 
                    ? "bg-neutral-950 text-indigo-400 border border-neutral-800 shadow-md shadow-neutral-950/35" 
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                <Compass className="h-4 w-4" />
                Personalized Hub & Catalogue
              </button>
              
              <button
                onClick={() => setActiveTab("analytics")}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "analytics" 
                    ? "bg-neutral-950 text-indigo-400 border border-neutral-800 shadow-md shadow-neutral-950/35" 
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                SVD Analytics & Rating Distributions
              </button>
            </div>

            {/* TAB CONTENTS 1: Recommendations Hub */}
            {activeTab === "recommendations" && (
              <div className="space-y-6">
                
                {/* Showcase recommendations */}
                <section>
                  <div className="mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-500 animate-pulse" />
                    <h2 className="text-lg font-bold text-neutral-100 font-sans">
                      Top Picks For {selectedUser.name}
                    </h2>
                  </div>

                  {topPersonalRecs.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-neutral-800 p-8 text-center text-neutral-400 bg-neutral-900/20">
                      <Tv className="mx-auto h-10 w-10 text-neutral-600 mb-2" />
                      <p className="text-sm font-bold">All caught up!</p>
                      <p className="text-xs mt-1 text-neutral-500 leading-normal">You have rated every single movie. Remove a few ratings below to see how recommendations change!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {topPersonalRecs.map((rec) => (
                        <MovieCard
                          key={rec.movie.id}
                          movie={rec.movie}
                          predictedRating={rec.predictedRating}
                          contentSimilarityScore={rec.contentSimilarityScore}
                          hybridScore={rec.hybridScore}
                          onRate={(stars) => handleRateMovie(rec.movie.id, stars)}
                          showMetrics={true}
                        />
                      ))}
                    </div>
                  )}
                </section>

                {/* Explore Movie Catalogue with filters */}
                <section className="border-t border-neutral-800 pt-6">
                  <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-neutral-100 font-sans">All System Movies</h2>
                      <p className="text-xs text-neutral-400 leading-relaxed mt-0.5">Rate films here to live-train your SVD and Content preference matrices.</p>
                    </div>

                    {/* Filter elements */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Search */}
                      <input
                        type="text"
                        placeholder="Search movies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-xs text-neutral-200 placeholder-neutral-500 outline-none focus:border-indigo-500/40"
                      />

                      {/* Genre dropdown */}
                      <select
                        value={selectedGenre}
                        onChange={(e) => setSelectedGenre(e.target.value)}
                        className="rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-xs text-neutral-300 outline-none cursor-pointer focus:border-indigo-500/40"
                      >
                        <option value="All">All Genres</option>
                        {GENRES.map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {filteredCatalogue.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-neutral-800 p-8 text-center text-neutral-400 bg-neutral-900/20">
                      <Info className="mx-auto h-10 w-10 text-neutral-600 mb-2" />
                      <p className="text-sm font-bold">No movies match your filters.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                      {filteredCatalogue.map((rec) => (
                        <MovieCard
                          key={rec.movie.id}
                          movie={rec.movie}
                          userRating={rec.userRating}
                          onRate={(stars) => handleRateMovie(rec.movie.id, stars)}
                          predictedRating={rec.predictedRating}
                          contentSimilarityScore={rec.contentSimilarityScore}
                          hybridScore={rec.hybridScore}
                          showMetrics={false}
                        />
                      ))}
                    </div>
                  )}
                </section>

              </div>
            )}

            {/* TAB CONTENTS 2: Analytics Distributions */}
            {activeTab === "analytics" && (
              <SvdDashboard
                ratingsDistribution={ratingsDistribution}
                genreAffinities={genreAffinities}
                rmseHistory={svdModel.rmseHistory}
                movieFactors2D={movieFactors2D}
                selectedUserName={selectedUser.name}
              />
            )}

          </main>

          {/* Right Column: Cinephile Oracle chatbot */}
          <aside className="lg:col-span-4">
            <div className="sticky top-6">
              <CinephileOracle
                userRatings={movieRecommendations
                  .filter((rec) => rec.isRated)
                  .map((rec) => ({
                    ...rec.movie,
                    rating: rec.userRating as number
                  }))
                }
                topRecommendations={movieRecommendations
                  .filter((rec) => !rec.isRated)
                  .sort((a, b) => b.hybridScore - a.hybridScore)
                  .slice(0, 5)
                }
                hybridWeight={hybridWeight}
              />
            </div>
          </aside>

        </div>

      </div>
    </div>
  );
}
