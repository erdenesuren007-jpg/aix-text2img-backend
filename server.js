require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Test homepage
app.get("/", (req, res) => {
  res.send("AIX Studio Text-to-Image backend is running.");
});

// Main image generation endpoint
app.post("/generate", async (req, res) => {
  try {
    const { prompt, style } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Combine prompt + style (if style exists)
    const fullPrompt = style ? `${prompt}, ${style}` : prompt;

    const result = await client.images.generate({
      model: "gpt-image-1",
      prompt: fullPrompt,
      size: "1024x1024"
    });

    const imageUrl = result.data[0].url;
    res.json({ imageUrl });

  } catch (error) {
    console.error("Image generation error:", error);
    res.status(500).json({ error: "Failed to generate image" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`AIX backend running on port ${PORT}`);
});
