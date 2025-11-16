require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");

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

// Image generation endpoint
app.post("/generate", async (req, res) => {
  try {
    const { prompt, style } = req.body;

    const fullPrompt = `${prompt}. Style: ${style}`;

    const result = await client.images.generate({
      model: "gpt-image-1",
      prompt: fullPrompt,
      size: "1024x1024",
    });

    res.json({ imageUrl: result.data[0].url });
  } catch (err) {
    console.error("Image API error:", err);
    res.status(500).json({ error: "Image generation failed" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
