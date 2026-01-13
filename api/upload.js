import system_prompt from '../system_prompt.js';
import { OpenAI } from 'openai';

// Vercel Serverless Function config
export const config = {
    api: {
        bodyParser: false, // We need to parse multipart form data manually
    },
};

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
});

// Simple multipart form parser for Vercel
async function parseMultipartForm(request) {
    const contentType = request.headers.get('content-type') || '';

    if (!contentType.includes('multipart/form-data')) {
        throw new Error('Expected multipart/form-data');
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
        throw new Error('No file uploaded');
    }

    const arrayBuffer = await file.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

// Extract text from PDF using pdf-parse v2.x
async function parsePDF(buffer) {
    // Dynamic import for pdf-parse - using named import for v2.x class-based API
    const { PDFParse } = await import('pdf-parse');
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return result.text;  // getText() returns a TextResult object with a .text property
}

export default async function handler(request) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    }

    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        // Parse the uploaded file
        const buffer = await parseMultipartForm(request);

        // Extract text from PDF
        const pdfText = await parsePDF(buffer);

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
            return new Response(JSON.stringify({ response: 'OpenAI API key not found' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });
        }

        // Call OpenAI
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: final_prompt }],
        });

        const response = completion.choices[0].message.content;
        console.log('OpenAI response received');

        return new Response(JSON.stringify({ response }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });

    } catch (error) {
        console.error('Error processing request:', error);
        return new Response(JSON.stringify({
            response: 'Failed to generate response',
            error: error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    }
}
