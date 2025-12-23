import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT_PATH = path.join(__dirname, 'system_prompt.md');

app.post('/api/analyze', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        // 1. Read the PDF file
        // 1. Read the PDF file
        const dataBuffer = fs.readFileSync(req.file.path);
        const pdfData = await pdf(dataBuffer);
        const pdfText = pdfData.text;

        // 2. Read the System Prompt
        let systemPrompt = '';
        try {
            systemPrompt = fs.readFileSync(SYSTEM_PROMPT_PATH, 'utf8');
        } catch (err) {
            console.error('Error reading system_prompt.md:', err);
            return res.status(500).json({ error: 'Failed to read system prompt' });
        }

        // 3. Construct the prompt for Ollama
        // We instruct Ollama with the system prompt and append the PDF text.
        // There are different ways to format this, but a simple concatenation usually works for Llama 3 / Mistral.
        // A better way for chat models is to use the "system" role if the API supports it, or just prepend.
        // For the raw generate API, we can just pass the full prompt.
        
        const finalPrompt = `${systemPrompt}\n\n=== DOCUMENT START ===\n${pdfText}\n=== DOCUMENT END ===\n\nAnalyze the document above based on the system instructions.`;

        // 4. Call Ollama
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3', // or 'mistral'
                prompt: finalPrompt,
                stream: false, // We want the full response at once for simplicity
                format: 'json' // Force JSON output if the model supports it (Llama 3 does)
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ollama API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        
        // Clean up the uploaded file
        fs.unlinkSync(req.file.path);

        // 5. Return the result
        res.json(data);

    } catch (error) {
        console.error('Error processing file:', error);
        // Clean up on error too
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
