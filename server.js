const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = process.env.OPENAI_API_KEY;

if (!API_KEY) {
    console.error("❌ ERROR: Missing OPENAI_API_KEY in environment variables.");
    process.exit(1);
}

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
        console.error("❌ OpenAI API Error:", error.response ? error.response.data : error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data || "Internal Server Error",
        });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Proxy running on port ${PORT}`));
