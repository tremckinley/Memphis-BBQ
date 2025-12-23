/**
 * AIService - WebLLM wrapper for in-browser LLM inference
 */
import * as webllm from '@mlc-ai/web-llm';

// Use Llama-3.2-3B with 128K context window - needed for long RFP documents
// Larger context but still reasonable download size (~2GB)
const DEFAULT_MODEL = 'Llama-3.2-3B-Instruct-q4f16_1-MLC';

let engine = null;
let isInitializing = false;

/**
 * Check if browser supports WebGPU
 */
export async function checkWebGPUSupport() {
    if (!navigator.gpu) {
        return { supported: false, reason: 'WebGPU is not supported in this browser. Please use Chrome 113+, Edge 113+, or Safari 18+.' };
    }

    try {
        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) {
            return { supported: false, reason: 'No WebGPU adapter found. Your device may not support GPU acceleration.' };
        }
        return { supported: true };
    } catch (e) {
        return { supported: false, reason: `WebGPU check failed: ${e.message}` };
    }
}

/**
 * Initialize the WebLLM engine with progress callbacks
 * @param {Function} onProgress - Callback for loading progress updates
 * @returns {Promise<void>}
 */
export async function initializeEngine(onProgress = () => { }) {
    if (engine) return; // Already initialized
    if (isInitializing) {
        // Wait for existing initialization
        while (isInitializing) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return;
    }

    isInitializing = true;

    try {
        const gpuCheck = await checkWebGPUSupport();
        if (!gpuCheck.supported) {
            throw new Error(gpuCheck.reason);
        }

        engine = await webllm.CreateMLCEngine(DEFAULT_MODEL, {
            initProgressCallback: (progress) => {
                onProgress({
                    text: progress.text,
                    progress: progress.progress, // 0 to 1
                });
            },
        });
    } finally {
        isInitializing = false;
    }
}

/**
 * Analyze RFP text and return structured JSON
 * @param {string} rfpText - The extracted text from the RFP document
 * @param {string} systemPrompt - The system prompt with JSON schema
 * @param {Function} onStream - Callback for streaming response chunks
 * @returns {Promise<Object>} - Parsed JSON result
 */
export async function analyzeRFP(rfpText, systemPrompt, onStream = () => { }) {
    if (!engine) {
        throw new Error('Engine not initialized. Call initializeEngine first.');
    }

    const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: rfpText },
    ];

    let fullResponse = '';

    const chunks = await engine.chat.completions.create({
        messages,
        temperature: 0.1, // Low temperature for consistent JSON output
        stream: true,
        response_format: { type: 'json_object' }, // Request JSON mode
    });

    for await (const chunk of chunks) {
        const content = chunk.choices[0]?.delta?.content || '';
        fullResponse += content;
        onStream(fullResponse);
    }

    // Parse the JSON response
    try {
        // Find JSON in the response (in case there's extra text)
        const jsonMatch = fullResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No valid JSON found in response');
        }
        return JSON.parse(jsonMatch[0]);
    } catch (e) {
        console.error('Failed to parse JSON:', fullResponse);
        throw new Error(`Failed to parse AI response as JSON: ${e.message}`);
    }
}

/**
 * Get the current engine status
 */
export function getEngineStatus() {
    return {
        initialized: !!engine,
        initializing: isInitializing,
    };
}

/**
 * Reset the engine (useful for testing or switching models)
 */
export async function resetEngine() {
    if (engine) {
        await engine.unload();
        engine = null;
    }
}
