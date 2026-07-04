import React from "react";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Cell
} from "recharts";
import { EpochMetric, MovieFactor2D, UserRatingDistribution, UserGenreAffinity } from "../types";
import { GitBranch, TrendingDown, Target, BarChart3, Database } from "lucide-react";

interface SvdDashboardProps {
  ratingsDistribution: UserRatingDistribution[];
  genreAffinities: UserGenreAffinity[];
  rmseHistory: EpochMetric[];
  movieFactors2D: MovieFactor2D[];
  selectedUserName: string;
}

export default function SvdDashboard({
  ratingsDistribution,
  genreAffinities,
  rmseHistory,
  movieFactors2D,
  selectedUserName
}: SvdDashboardProps) {

  // Custom styling for Tooltips
  const customTooltipStyle = {
    backgroundColor: "rgba(10, 10, 10, 0.95)",
    border: "1px solid rgba(99, 102, 241, 0.25)",
    borderRadius: "12px",
    color: "#f5f5f5",
    fontFamily: "JetBrains Mono, monospace",
    fontSize: "11px",
    padding: "8px 12px"
  };

  // Color generator based on genres for latent space plot
  const getGenreColor = (genres: string[]) => {
    if (genres.includes("Sci-Fi") || genres.includes("Action")) return "#6366f1"; // Indigo
    if (genres.includes("Romance") || genres.includes("Drama")) return "#a855f7"; // Purple
    if (genres.includes("Comedy")) return "#eab308"; // Yellow
    if (genres.includes("Animation")) return "#06b6d4"; // Cyan
    return "#10b981"; // Emerald/Other
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="svd-analytical-dashboard">
      
      {/* 1. Rating Distribution Chart */}
      <div className="rounded-3xl border border-neutral-800 bg-neutral-900/90 p-6 shadow-md shadow-black/20 backdrop-blur-md">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-indigo-500" />
          <h4 className="font-sans text-sm font-bold text-neutral-200">
            Rating Distribution ({selectedUserName})
          </h4>
        </div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ratingsDistribution} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(64, 64, 64, 0.2)" />
              <XAxis dataKey="rating" stroke="#737373" fontSize={11} tickLine={false} />
              <YAxis stroke="#737373" fontSize={11} tickLine={false} allowDecimals={false} />
              <Tooltip 
                contentStyle={customTooltipStyle}
                cursor={{ fill: "rgba(99, 102, 241, 0.05)" }}
                formatter={(value: any) => [`${value} votes`, "Ratings Count"]}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {ratingsDistribution.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.count > 0 ? "rgba(99, 102, 241, 0.85)" : "rgba(115, 115, 115, 0.15)"} 
                    stroke="rgba(99, 102, 241, 0.5)"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Genre Affinities Chart */}
      <div className="rounded-3xl border border-neutral-800 bg-neutral-900/90 p-6 shadow-md shadow-black/20 backdrop-blur-md">
        <div className="mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-indigo-500" />
          <h4 className="font-sans text-sm font-bold text-neutral-200">
            Genre Affinity Profiles ({selectedUserName})
          </h4>
        </div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={genreAffinities} 
              layout="vertical"
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(64, 64, 64, 0.2)" />
              <XAxis type="number" stroke="#737373" fontSize={10} tickLine={false} />
              <YAxis dataKey="genre" type="category" stroke="#737373" fontSize={10} tickLine={false} width={75} />
              <Tooltip 
                contentStyle={customTooltipStyle}
                formatter={(value: any) => [`Affinity Score: ${parseFloat(value).toFixed(2)}`, "Genre Value"]}
              />
              <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                {genreAffinities.map((entry, index) => {
                  const isPositive = entry.score >= 0;
                  return (
                    <Cell 
                      key={`cell-${index}`}
                      fill={isPositive ? "rgba(16, 185, 129, 0.8)" : "rgba(239, 68, 68, 0.7)"}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. SVD Model Optimization (SGD Learning Convergence) */}
      <div className="rounded-3xl border border-neutral-800 bg-neutral-900/90 p-6 shadow-md shadow-black/20 backdrop-blur-md">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-indigo-500" />
            <h4 className="font-sans text-sm font-bold text-neutral-200">
              SVD Optimization Path (SGD Convergence)
            </h4>
          </div>
          <span className="rounded-lg bg-neutral-950 px-2.5 py-1 text-[10px] font-mono text-indigo-400 border border-neutral-800">
            Matrix Factorization
          </span>
        </div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rmseHistory} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(64, 64, 64, 0.2)" />
              <XAxis dataKey="epoch" stroke="#737373" fontSize={10} tickLine={false} />
              <YAxis stroke="#737373" fontSize={10} tickLine={false} domain={["auto", "auto"]} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Legend verticalAlign="top" height={36} iconSize={10} wrapperStyle={{ fontSize: "10px", fontFamily: "monospace" }} />
              <Line 
                name="RMSE (Root Mean Sq. Error)" 
                type="monotone" 
                dataKey="rmse" 
                stroke="#6366f1" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                name="MAE (Mean Absolute Error)" 
                type="monotone" 
                dataKey="mae" 
                stroke="#a855f7" 
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. SVD Movie Latent Factors Mapping */}
      <div className="rounded-3xl border border-neutral-800 bg-neutral-900/90 p-6 shadow-md shadow-black/20 backdrop-blur-md">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-indigo-500" />
            <h4 className="font-sans text-sm font-bold text-neutral-200">
              SVD Latent Space Mapping (Top 2 Factors)
            </h4>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-neutral-500">
            <span className="inline-block h-2 w-2 rounded-full bg-indigo-500" /> SciFi/Action
            <span className="inline-block h-2 w-2 rounded-full bg-purple-500" /> Drama/Rom
            <span className="inline-block h-2 w-2 rounded-full bg-yellow-500" /> Comedy
          </div>
        </div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid stroke="rgba(64, 64, 64, 0.15)" />
              <XAxis type="number" dataKey="x" name="Latent Factor 1" stroke="#525252" fontSize={9} />
              <YAxis type="number" dataKey="y" name="Latent Factor 2" stroke="#525252" fontSize={9} />
              <Tooltip 
                contentStyle={customTooltipStyle}
                cursor={{ strokeDasharray: "3 3" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as MovieFactor2D;
                    return (
                      <div className="rounded-2xl border border-indigo-500/20 bg-neutral-950/95 p-3 font-mono text-xs shadow-xl backdrop-blur-md">
                        <p className="font-sans font-bold text-neutral-200">{data.title}</p>
                        <p className="mt-1 text-[10px] text-neutral-400">Genres: {data.genres.join(", ")}</p>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-[9px] text-neutral-500 border-t border-neutral-800/80 pt-1.5">
                          <div>F1: {data.x.toFixed(3)}</div>
                          <div>F2: {data.y.toFixed(3)}</div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter name="Movies" data={movieFactors2D} fill="#6366f1">
                {movieFactors2D.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getGenreColor(entry.genres)}
                    className="cursor-pointer transition-all hover:r-4"
                    r={6}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
