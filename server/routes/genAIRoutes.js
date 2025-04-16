const express = require('express');
const { geminiPrompt } = require("../controllers/geminiPromptController");

const router = express.Router();

router.post("/gemini-prompt", geminiPrompt)

module.exports = router
