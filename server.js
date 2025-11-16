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

// ROUTE: POST /generate
app.post("/generate", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const result = await client.images.generate({
      model: "gpt-image-1",
      prompt: prompt,
      size: "1024x1024",
    });

    res.json({ image: result.data[0].url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// PORT for Render
const port = process.env.PORT || 10000;
app.listen(port, () => console.log("Server running on port " + port));

