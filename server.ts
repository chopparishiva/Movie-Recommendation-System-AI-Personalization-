import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client to prevent crashes if key is initially empty
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing. Please configure it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST API for Gemini-powered movie recommendations analysis and discussions
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { userRatings, topRecommendations, message, chatHistory, hybridWeight } = req.body;

    const ai = getGeminiClient();

    // Format ratings and current recommendations for model context
    const ratingsContext = userRatings && userRatings.length > 0
      ? userRatings.map((r: any) => `- ${r.title}: ${r.rating} stars`).join("\n")
      : "No movies rated yet.";

    const recsContext = topRecommendations && topRecommendations.length > 0
      ? topRecommendations.map((rec: any, idx: number) => 
          `${idx + 1}. ${rec.movie.title} (Genres: ${rec.movie.genres.join(", ")}) | Match Score: ${rec.hybridScore.toFixed(1)}% | SVD Predict: ${rec.predictedRating.toFixed(1)}★ | Content Sim: ${(rec.contentSimilarityScore * 100).toFixed(0)}%`
        ).join("\n")
      : "No recommendations available.";

    const systemInstruction = `You are "The Cinephile Oracle", an elite movie recommendation expert, critic, and algorithmic explanation assistant.
Your goal is to discuss movie recommendations with the user. You have access to their direct rating history and their top algorithmic recommendations.

User's current Hybrid Weight settings: ${hybridWeight}% Collaborative Filtering (SVD) vs ${100 - hybridWeight}% Content-Based (Genres similarity).

User's Rating History:
${ratingsContext}

Algorithmic Recommendations Generated:
${recsContext}

Your communication guidelines:
1. Explain the ALGORITHMIC REASONING of why these specific movies were recommended based on the Hybrid balance. For instance:
   - SVD predictions reflect matching patterns from other users who liked similar movies (Collaborative).
   - Content Similarity reflects direct genre matching with their highly rated movies (Content).
2. Suggest cohesive, themed double-features or trilogies from their recommendations list.
3. Keep your tone intellectual, deeply passionate about cinema, yet friendly and accessible. 
4. Avoid generic "as an AI" phrases. Talk like a real film critic. Use clean, beautiful markdown.`;

    // Filter history to ensure it starts with a user message to satisfy Gemini requirements,
    // and format history as valid Content objects.
    const firstUserIdx = (chatHistory || []).findIndex((ch: any) => ch.role === "user");
    const historyToFormat = firstUserIdx !== -1 ? chatHistory.slice(firstUserIdx) : [];

    const formattedHistory = historyToFormat.map((ch: any) => ({
      role: ch.role === "user" ? "user" as const : "model" as const,
      parts: [{ text: ch.text }]
    }));

    // Generate response using gemini-3.5-flash as mandated for text QA.
    // Ensure all items in contents are valid Content objects (role + parts) to avoid mixing Content and Parts.
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        ...formattedHistory,
        { role: "user", parts: [{ text: message }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.8,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    res.status(500).json({ 
      error: error.message || "An error occurred with the Gemini API.",
      isConfigError: !process.env.GEMINI_API_KEY 
    });
  }
});

// Setup Vite Dev server or Production static serving
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server middleware loaded.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production build assets loaded from /dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Application server running at http://0.0.0.0:${PORT}`);
  });
}

setupServer();
