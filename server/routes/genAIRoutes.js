const express = require('express');
const router = express.Router();
import { geminiPrompt } from "../controllers/geminiPromptController";

router.post("/gemini-prompt", geminiPrompt)
