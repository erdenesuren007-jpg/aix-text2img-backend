require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

// OpenAI client using your project key from Render env var
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simple health check
app.get("/", (req, res) => {
  res.send("AIX text2img backend is running ✅");
});

// Image generation endpoint
app.post("/generate", async (req, res) => {
  const { prompt, style } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    const fullPrompt = `${prompt}. Style: ${style || "Realistic"}.`;

    const result = await client.images.generate({
      model: "gpt-image-1",
      prompt: fullPrompt,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = result.data[0].url;
    res.json({ imageUrl });
  } catch (err) {
    console.error("Image API error:", err);
    res.status(500).json({ error: "Image generation failed" });
  }
});

// Render will inject PORT, fallback for local dev
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
