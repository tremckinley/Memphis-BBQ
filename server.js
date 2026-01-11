import path from 'path';
import fs from 'fs';
import system_prompt from './system_prompt.js';
import { PDFParse } from 'pdf-parse';
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { OpenAI } from 'openai';

// express server
const app = express();
const PORT = process.env.PORT || 3001;
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
});


async function parsePDF(buffer) {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return result.text;  // getText() returns a TextResult object with a .text property
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Enable CORS for the frontend dev server
app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use(express.json())

const upload = multer();

app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const pdfText = await parsePDF(req.file.buffer);

    let final_prompt = '';
    final_prompt += system_prompt;
    final_prompt += '\n\n';
    final_prompt += `=========START of Document========= \n\n`
    final_prompt += pdfText;
    final_prompt += '\n\n';
    final_prompt += `=========END of Document========= \n\n`

    console.log(final_prompt);
    //fs.writeFileSync('final_prompt.txt', final_prompt);


    let response = '';
    if (!openai) {
        response = 'OpenAI API key not found';
    }

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: final_prompt }],
        });
        console.log(completion.choices[0].message.content);
        response = completion.choices[0].message.content;
        // fs.writeFileSync('response.txt', response);
    } catch (error) {
        console.error(error);
        response = 'Failed to generate response';
    }

    res.json({ response });
});
