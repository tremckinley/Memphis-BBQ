import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

console.log('Type of pdf import:', typeof pdf);
console.log('Is pdf a function?', typeof pdf === 'function');
console.log('Keys of pdf:', Object.keys(pdf));

try {
    const dataBuffer = fs.readFileSync('RFP-HEALTHY-HOMES-ASSESSMENTS.pdf');
    
    // Test 1: calling pdf directly 
    if (typeof pdf === 'function') {
        console.log('Test 1: calling pdf(buffer)...');
        try {
            const res = await pdf(dataBuffer);
            console.log('Test 1 success. Text len:', res.text.length);
        } catch (e) {
            console.error('Test 1 failed:', e.message);
        }
    } else {
        console.log('Test 1 skipped: pdf is not a function');
    }

    // Test 2: calling pdf.default(buffer)
    if (pdf.default && typeof pdf.default === 'function') {
        console.log('Test 2: calling pdf.default(buffer)...');
        try {
            const res = await pdf.default(dataBuffer);
            console.log('Test 2 success. Text len:', res.text.length);
        } catch (e) {
             console.error('Test 2 failed:', e.message);
        }
    } else {
        console.log('Test 2 skipped: pdf.default is not a function');
    }

    // Test 3: calling pdf.PDFParse(buffer)
    if (pdf.PDFParse) {
        console.log('Test 3: calling pdf.PDFParse...');
        try {
            // Check if class or function
            let res;
            if (typeof pdf.PDFParse === 'function') {
                 // Try as function
                 try {
                    res = await pdf.PDFParse(dataBuffer);
                 } catch (e) {
                    console.error('Test 3 function call failed, trying new:', e.message);
                    res = new pdf.PDFParse(dataBuffer);
                 }
            }
             console.log('Test 3 success? Type:', typeof res);
        } catch (e) {
             console.error('Test 3 failed:', e.message);
        }
    } else {
        console.log('Test 3 skipped: No PDFParse property');
    }

} catch (e) {
    console.error('Main Error:', e);
}
