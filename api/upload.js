import system_prompt from '../system_prompt.js';
import { OpenAI } from 'openai';
import { extractText } from 'unpdf';
import { IncomingForm } from 'formidable';
import fs from 'fs';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
});

// Disable body parsing - we'll handle multipart form data ourselves
export const config = {
    api: {
        bodyParser: false,
    },
};

// Parse multipart form data using formidable
function parseForm(req) {
    return new Promise((resolve, reject) => {
        const form = new IncomingForm();
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            else resolve({ fields, files });
        });
    });
}

// Extract text from PDF using unpdf (serverless-compatible)
async function parsePDF(buffer) {
    const { text } = await extractText(buffer);
    return text;
}

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Parse the form data
        const { files } = await parseForm(req);

        // Get the uploaded file - formidable v3 returns files as arrays
        const uploadedFile = files.file?.[0] || files.file;

        if (!uploadedFile) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Read the file buffer
        const buffer = fs.readFileSync(uploadedFile.filepath);

        // Extract text from PDF
        const pdfText = await parsePDF(buffer);

        // Clean up temp file
        fs.unlinkSync(uploadedFile.filepath);

        // Build the prompt
        let final_prompt = '';
        final_prompt += system_prompt;
        final_prompt += '\n\n';
        final_prompt += `=========START of Document========= \n\n`;
        final_prompt += pdfText;
        final_prompt += '\n\n';
        final_prompt += `=========END of Document========= \n\n`;

        console.log('Processing PDF, text length:', pdfText.length);

        // Check for OpenAI API key
        if (!process.env.OPENAI_API_KEY) {
            return res.status(500).json({ response: 'OpenAI API key not found' });
        }

        // Call OpenAI
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: final_prompt }],
        });

        const response = completion.choices[0].message.content;
        console.log('OpenAI response received');

        return res.status(200).json({ response });

    } catch (error) {
        console.error('Error processing request:', error);
        return res.status(500).json({
            response: 'Failed to generate response',
            error: error.message
        });
    }
}
