import React, { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';

export default function DocSubmissionForm({ onAnalysisComplete }: { onAnalysisComplete: (data: any) => void }) {
    const [isLoading, setIsLoading] = useState(false);
    
    // We don't need local analysisResult anymore if we are passing it up immediately
    // const [analysisResult, setAnalysisResult] = useState<any>(null);

    const handleSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;
        
        setIsLoading(true);
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:3000/api/analyze', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Analysis failed');
            }

            const data = await response.json();
            
            let parsedResult = data.response;
            try {
                if (typeof data.response === 'string') {
                    parsedResult = JSON.parse(data.response);
                }
            } catch (e) {
                console.warn("Could not parse JSON response:", e);
                // If parsing fails but we have a string, maybe just pass the raw data or handle error
                // For now, let's assume if it's not JSON, it might be the object itself if backend handled it
                parsedResult = data.response || data; 
            }
            
            if (onAnalysisComplete) {
                onAnalysisComplete(parsedResult);
            }

        } catch (error) {
            console.error(error);
            alert('Error analyzing document');
        } finally {
            setIsLoading(false);
        }
    }


    return (
    <div className="min-h-screen bg-[#00698B90] pt-24">
        <div className="bg-[azure] shadow-lg shadow-gray-600  fixed z-100 top-0 w-full">

                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-center">
                        <img
                            src='/icon.png'
                            height={"80px"}
                            width={"80px"}
                            className='p-1'
                        />
                        <div className='text-3xl font-bold ml-2'>Memphis B.B.Q. AI</div>
                    </div>
                </div>
            </div>
        <div className="min-h-screen bg-[#00698B90] flex items-center justify-center p-6">
            <div className="bg-yellow-200 rounded-lg shadow-xl border border-slate-200 p-8 max-w-2xl w-full">
                
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center gap-6 py-12">
                        <div className="p-6 bg-blue-50 rounded-full">
                            <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Analyzing Proposal...</h2>
                            <p className="text-slate-600">This may take a minute while the AI reads the document</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-6">
                        <div className="p-6 bg-slate-200 rounded-full">
                            <Upload className="w-16 h-16 text-[#00698B]" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Upload a Proposal/Quote</h2>
                            <p className="text-slate-600 mb-2">Upload a PDF to extract key insights</p>
                        </div>

                        <label className="w-full">
                            <div className="w-full bg-blue-900 hover:bg-[#606060] text-white font-semibold py-4 px-8 rounded-lg transition-colors text-lg text-center cursor-pointer">
                                Select PDF Document
                            </div>
                            <input 
                                type="file" 
                                className="hidden"
                                accept=".pdf"
                                onChange={handleSubmit}
                            />
                        </label>
                    </div>
                )}
            </div>
        </div>
    </div>
    )
}