import fs from 'fs';
import { PDFParse } from 'pdf-parse';

async function testPDF() {
    const buffer = fs.readFileSync('./resume.pdf');
    console.log('Buffer length:', buffer.length);

    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();

    console.log('Result type:', typeof result);
    console.log('result.text type:', typeof result.text);
    console.log('--- EXTRACTED TEXT (first 500 chars) ---');
    console.log(result.text.substring(0, 500));
    console.log('--- END ---');
}

testPDF().catch(console.error);
