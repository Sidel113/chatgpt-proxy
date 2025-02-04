const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Allows all origins (you can customize this if needed)

// Fetch API Key from environment variables
const API_KEY = process.env.NGOuGlkzIW1ld8jrKQLperYuXhfx44K_Dws1OD7wUapTTZCAWyMRTHQqALiE0vqBWusPl8amyVT3BlbkFJdKqonX8tYweJLkjTN3G7KIiKlAs_oHkhqvdMoccjCMQJplF6TcZmmnefQUP8hPsqPDrnKWsrUA;

if (!API_KEY) {
    console.error("❌ Error: Missing OPENAI_API_KEY environment variable.");
    process.exit(1); // Stop server if API key is missing
}

// Proxy Route
app.post("/proxy", async (req, res) => {
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            req.body,
            {
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error("❌ API Request Error:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: "Error fetching response from OpenAI",
            details: error.response?.data || error.message,
        });
    }
});

// Health Check Route (for Render)
app.get("/healthz", (req, res) => {
    res.status(200).send("OK");
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Proxy running on port ${PORT}`));
