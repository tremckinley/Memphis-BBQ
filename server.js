import express from 'express';
import cors from 'cors';
import multer from 'multer';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({ dest: 'uploads/' });

// Increase JSON limit just in case, though we aren't sending JSON *to* server, we receive big JSON
app.use(express.json({ limit: '50mb' }));
app.use(cors());

const SYSTEM_PROMPT_PATH = path.join(__dirname, 'system_prompt.md');

app.post('/api/analyze', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        console.log('Processing file:', req.file.path);
        
        // 1. Convert PDF to Images using Puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        // Load PDF as data URI
        const pdfData = fs.readFileSync(req.file.path);
        const pdfBase64 = pdfData.toString('base64');
        const dataUri = `data:application/pdf;base64,${pdfBase64}`;
        
        // We can't view PDF directly in headless easily, but we can verify it loads.
        // ACTUALLY: Puppeteer headless doesn't render PDF viewer nicely to screenshots.
        // A better pure-js approach with Puppeteer is to use pdf.js inside the browser context of Puppeteer!
        // But that's complicated to inject.
        // Simpler hack: Use an online viewer? No local.
        
        // WAIT. Chrome Headless *can* take screenshots of PDFs if we just wait for it? 
        // No, usually it downloads it.
        
        // Alternatives:
        // Use `pdfjs-dist` inside the server logic, but mock canvas with a fake implementation?
        // Or strictly use `pdfjs-dist` inside Puppeteer page page.evaluate().
        
        // Let's TRY `pdfjs-dist` inside Puppeteer page context.
        // We navigate to a blank page. Inject pdf.js. Render to canvas. Extract Data URL.
        
        // Actually, maybe there's a simpler way:
        // "Mozilla PDF.js" is pure JS. We can just use it in the browser context that Puppeteer provides!
        
        await page.goto('about:blank');
        
        // We need to inject pdf.js library. 
        // We can use a CDN link or read local file?
        // Let's use a CDN for simplicity of the script, or bundle it?
        // Local is better. But I don't have it installed visibly.
        // I'll inject a script tag pointing to cdnjs.
        
        await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js' });
        await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js' });

        const imageArrays = await page.evaluate(async (pdfData) => {
            // Processing inside browser
            // @ts-ignore
            const pdfjsLib = window['pdfjs-dist/build/pdf'];
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            
            // Decode base64 
            const binaryString = window.atob(pdfData);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            const loadingTask = pdfjsLib.getDocument({ data: bytes });
            const pdf = await loadingTask.promise;
            const numPages = pdf.numPages;
            const images = [];
            
            // Limit to 5 pages
            const pagesToProcess = Math.min(numPages, 5);

            for (let i = 1; i <= pagesToProcess; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 1.5 }); // Reduced scale for performance
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: context, viewport: viewport }).promise;
                
                // Get Base64 JPEG (cleaner for LLM than PNG sometimes, and smaller)
                let dataUrl = canvas.toDataURL('image/jpeg', 0.8); 
                // Remove prefix
                dataUrl = dataUrl.split(',')[1];
                images.push(dataUrl);
            }
            return images;
        }, pdfBase64);

        await browser.close();
        
        console.log(`Converted PDF to ${imageArrays.length} images.`);

        // 2. Read System Prompt
        let systemPrompt = '';
        try {
            systemPrompt = fs.readFileSync(SYSTEM_PROMPT_PATH, 'utf8');
        } catch (err) {
            console.error('Error reading prompt:', err);
            return res.status(500).json({ error: 'System prompt missing' });
        }

        // Limit to first 3 pages to avoid context window explosion if PDF is huge
        // LLaVA can handle images, but too many might confuse it or OOM.
        const imagesToProcess = imageArrays.slice(0, 3); 

        // 3. Call Ollama (LLaVA)
        // LLaVA expects `images` field in the request.
        // Format: { model: "llava", prompt: "...", images: ["base64..."] }
        
        console.log(`Sending request to Ollama (llava) with ${imagesToProcess.length} images...`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 600000); // 10 minute timeout

        try {
            const response = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'llava',
                    prompt: `${systemPrompt}\n\nI have attached the pages of the RFP document as images. Analyze them and output the required JSON.`,
                    images: imagesToProcess,
                    stream: false,
                    format: 'json'
                }),
                signal: controller.signal
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Ollama Error: ${response.status} - ${errText}`);
            }

            const data = await response.json();
            console.log('Ollama response received.');
            
            // Cleanup
            fs.unlinkSync(req.file.path);
            res.json(data);
            
        } finally {
            clearTimeout(timeoutId);
        }

    } catch (error) {
        console.error('Processing failed:', error);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
