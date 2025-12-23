/**
 * PDFService - Extract text from PDF files using pdf.js
 */
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Set up the worker using the bundled version
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/**
 * Extract text content from a PDF file
 * @param {File} file - The PDF file to extract text from
 * @param {Function} onProgress - Callback for extraction progress (0-100)
 * @returns {Promise<string>} - Extracted text content
 */
export async function extractTextFromPDF(file, onProgress = () => { }) {
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    const totalPages = pdf.numPages;
    const textParts = [];

    // Extract text from each page
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        // Combine text items with appropriate spacing
        const pageText = textContent.items
            .map(item => item.str)
            .join(' ');

        textParts.push(`--- Page ${pageNum} ---\n${pageText}`);

        // Report progress
        onProgress(Math.round((pageNum / totalPages) * 100));
    }

    return textParts.join('\n\n');
}

/**
 * Validate that a file is a PDF
 * @param {File} file - File to validate
 * @returns {Object} - { valid: boolean, error?: string }
 */
export function validatePDFFile(file) {
    if (!file) {
        return { valid: false, error: 'No file provided' };
    }

    if (file.type !== 'application/pdf') {
        return { valid: false, error: 'File must be a PDF document' };
    }

    // 50MB limit
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
        return { valid: false, error: 'File size must be under 50MB' };
    }

    return { valid: true };
}
