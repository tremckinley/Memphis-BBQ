// @ts-nocheck
import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileText, Loader2, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { extractTextFromPDF, validatePDFFile } from '../services/PDFService';
import { initializeEngine, analyzeRFP, checkWebGPUSupport, getEngineStatus } from '../services/AIService';
import systemPromptText from '../../system_prompt.md?raw';

const STEPS = {
    IDLE: 'idle',
    CHECKING_GPU: 'checking_gpu',
    LOADING_MODEL: 'loading_model',
    EXTRACTING_PDF: 'extracting_pdf',
    ANALYZING: 'analyzing',
    COMPLETE: 'complete',
    ERROR: 'error',
};

export default function RFPUploader({ onAnalysisComplete }) {
    const [step, setStep] = useState(STEPS.IDLE);
    const [progress, setProgress] = useState({ text: '', percent: 0 });
    const [error, setError] = useState(null);
    const [streamOutput, setStreamOutput] = useState('');
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const processFile = useCallback(async (file) => {
        // Validate file
        const validation = validatePDFFile(file);
        if (!validation.valid) {
            setError(validation.error);
            setStep(STEPS.ERROR);
            return;
        }

        try {
            // Step 1: Check WebGPU
            setStep(STEPS.CHECKING_GPU);
            setProgress({ text: 'Checking browser compatibility...', percent: 0 });

            const gpuCheck = await checkWebGPUSupport();
            if (!gpuCheck.supported) {
                throw new Error(gpuCheck.reason);
            }

            // Step 2: Initialize model (if needed)
            const status = getEngineStatus();
            if (!status.initialized) {
                setStep(STEPS.LOADING_MODEL);
                await initializeEngine((p) => {
                    setProgress({
                        text: p.text,
                        percent: Math.round(p.progress * 100),
                    });
                });
            }

            // Step 3: Extract PDF text
            setStep(STEPS.EXTRACTING_PDF);
            setProgress({ text: 'Extracting text from PDF...', percent: 0 });

            const pdfText = await extractTextFromPDF(file, (percent) => {
                setProgress({ text: 'Extracting text from PDF...', percent });
            });

            // Step 4: Analyze with AI
            setStep(STEPS.ANALYZING);
            setProgress({ text: 'AI is analyzing the RFP...', percent: 0 });
            setStreamOutput('');

            const result = await analyzeRFP(pdfText, systemPromptText, (chunk) => {
                setStreamOutput(chunk);
            });

            // Complete!
            setStep(STEPS.COMPLETE);
            onAnalysisComplete(result);

        } catch (err) {
            console.error('Processing error:', err);
            setError(err.message);
            setStep(STEPS.ERROR);
        }
    }, [onAnalysisComplete]);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    }, [processFile]);

    const handleFileSelect = useCallback((e) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    }, [processFile]);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleRetry = () => {
        setStep(STEPS.IDLE);
        setError(null);
        setStreamOutput('');
    };

    // Render based on current step
    const renderContent = () => {
        switch (step) {
            case STEPS.IDLE:
                return (
                    <div
                        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
              ${dragActive
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-gray-600 hover:border-gray-400 hover:bg-gray-800/50'
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={handleClick}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                        <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h2 className="text-2xl font-semibold mb-2">Upload RFP Document</h2>
                        <p className="text-gray-400 mb-4">
                            Drag and drop a PDF file here, or click to browse
                        </p>
                        <p className="text-sm text-gray-500">
                            PDF files up to 50MB supported
                        </p>
                    </div>
                );

            case STEPS.CHECKING_GPU:
            case STEPS.LOADING_MODEL:
            case STEPS.EXTRACTING_PDF:
                return (
                    <div className="border-2 border-gray-600 rounded-2xl p-12 text-center">
                        <Loader2 className="w-16 h-16 mx-auto mb-4 text-blue-500 animate-spin" />
                        <h2 className="text-xl font-semibold mb-2">{progress.text}</h2>
                        {progress.percent > 0 && (
                            <div className="max-w-md mx-auto">
                                <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="bg-blue-500 h-full transition-all duration-300"
                                        style={{ width: `${progress.percent}%` }}
                                    />
                                </div>
                                <p className="text-sm text-gray-400 mt-2">{progress.percent}%</p>
                            </div>
                        )}
                        {step === STEPS.LOADING_MODEL && (
                            <p className="text-sm text-gray-500 mt-4">
                                First-time setup: downloading AI model (~1GB). This is cached for future use.
                            </p>
                        )}
                    </div>
                );

            case STEPS.ANALYZING:
                return (
                    <div className="border-2 border-gray-600 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
                            <h2 className="text-xl font-semibold">AI is analyzing the RFP...</h2>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto font-mono text-sm">
                            <pre className="whitespace-pre-wrap text-gray-300">
                                {streamOutput || 'Starting analysis...'}
                            </pre>
                        </div>
                    </div>
                );

            case STEPS.COMPLETE:
                return (
                    <div className="border-2 border-green-600 rounded-2xl p-12 text-center">
                        <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                        <h2 className="text-2xl font-semibold mb-2">Analysis Complete!</h2>
                        <p className="text-gray-400">Loading dashboard...</p>
                    </div>
                );

            case STEPS.ERROR:
                return (
                    <div className="border-2 border-red-600 rounded-2xl p-12 text-center">
                        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                        <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
                        <p className="text-red-400 mb-6">{error}</p>
                        <button
                            onClick={handleRetry}
                            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                    <h1 className="text-4xl font-bold mb-2">RFP Analyzer</h1>
                    <p className="text-gray-400">
                        Upload an RFP document and let AI extract the key information
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                        Powered by local AI • No data leaves your browser
                    </p>
                </div>

                {renderContent()}
            </div>
        </div>
    );
}
