// @ts-nocheck
import React, { useState } from 'react';
import { CheckCircle, Circle, Upload, AlertCircle, Clock, DollarSign, MapPin, FileText, ChevronDown, ChevronUp, Info, X, Inbox, Loader2, InfoIcon, File, ArrowLeft } from 'lucide-react';
import { refresh } from 'less';
import Header from './Header';
import test_rfpdata from '../../rfp_data.js';

interface Subtask {
    id?: string;
    name?: string;
    title?: string;
    completed?: boolean;
}

interface Task {
    id?: string;
    name?: string;
    title?: string;
    completed?: boolean;
    expanded?: boolean;
    priority?: string;
    dueDate?: string;
    sourceText?: string;
    sourceSection?: string;
    subtasks?: Subtask[];
}

interface Document {
    id?: string;
    name?: string;
    uploaded?: boolean;
    required?: boolean;
    instructions?: string;
    sourceText?: string;
    sourceSection?: string;
}

interface KeyDate {
    event?: string;
    date?: string;
    time?: string;
}

interface RFPData {
    tasks?: Task[];
    requiredDocuments?: Document[];
    keyDates?: KeyDate[];
    projectInfo?: {
        rfpNumber?: string;
        title?: string;
    };
    summary?: {
        scope?: string;
        contractValue?: string;
        contractDuration?: string;
        sourceSection?: string;
        keyContacts?: Array<{ name?: string; role?: string; contactInfo?: string }>;
    };
    qualifications?: {
        eligibilityRequirements?: Array<{ requirement?: string; details?: string }>;
        insuranceRequirements?: Array<{ type?: string; amount?: string; details?: string }>;
        equipmentRequirements?: Array<{ item?: string }>;
    };
    disqualifiers?: Array<{ reason?: string }>;
    keyAddresses?: Array<{ address?: string; sourceSection?: string }>;
}


const RFPDashboard = () => {
    const [rfpData, setRFPData] = useState<RFPData | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [selectedInfo, setSelectedInfo] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState(null); // Store the selected file
    // 2. INITIALIZE STATE FROM THE IMPORTED JSON
    const [tasks, setTasks] = useState<Task[]>(rfpData?.tasks || []);
    const [documents, setDocuments] = useState<Document[]>(rfpData?.requiredDocuments || []);

    // Find the Bid Due Date from the imported data - check for various possible event names
    const bidDueDateInfo = rfpData?.keyDates?.find(d =>
        d.event?.toLowerCase()?.includes('due') ||
        d.event?.toLowerCase()?.includes('submission deadline')
    ) || { date: 'Not specified', time: 'Not specified' };

    const toggleTask = (taskId) => {
        setTasks(tasks.map(task =>
            task?.id === taskId ? { ...task, completed: !(task?.completed) } : task
        ));
    };

    const fakeSubmit = async () => {
        setIsLoading(true);
        setError(null);
        setRFPData(test_rfpdata);
        setTasks(test_rfpdata?.tasks || []);
        setDocuments(test_rfpdata?.requiredDocuments || []);
        // Simulate file upload/processing delay
        await new Promise(resolve => setTimeout(resolve, 5000));
        setSubmitted(true);
        setIsLoading(false);
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file); // Store in state
        setError(null); // Clear any previous errors
    };

    const processFile = async () => {
        if (!selectedFile) {
            console.error('No file selected');
            setError('Please select a file first');
            return;
        }
        console.log('Processing file...');
        setIsLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            const response = await fetch('http://localhost:3001/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);

            // Check if the response contains an error message
            if (data.response === 'Failed to generate response' || data.response === 'OpenAI API key not found') {
                throw new Error(data.response);
            }

            // Parse the response - strip markdown code fences if present and parse JSON
            let parsedResponse = data.response;
            if (typeof parsedResponse === 'string') {
                // Remove markdown code fences (```json ... ```)
                parsedResponse = parsedResponse.replace(/^```json\s*\n?/i, '').replace(/\n?```\s*$/i, '');
                parsedResponse = JSON.parse(parsedResponse);
            }

            setRFPData(parsedResponse);
            setTasks(parsedResponse?.tasks || []);
            setDocuments(parsedResponse?.requiredDocuments || []);
            setSubmitted(true);
            console.log('File processed successfully');
        } catch (error) {
            console.error(error);
            setError(error instanceof Error ? error.message : 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    // Error page component
    if (error && !isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#E8F4F8] via-[#F0F9FC] to-[#E8F4F8] flex items-center justify-center p-6">
                <div className="bg-white rounded-xl shadow-2xl border border-red-200 p-8 max-w-md w-full text-center">
                    <div className="p-4 bg-red-100 rounded-full w-fit mx-auto mb-4">
                        <AlertCircle className="w-12 h-12 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-red-700 mb-2">Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => setError(null)}
                        className="w-full bg-[#4A6785] hover:bg-[#1E3A5F] text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const toggleSubtask = (taskId, subtaskId) => {
        setTasks(tasks.map(task => {
            if (task?.id === taskId) {
                const updatedSubtasks = (task?.subtasks || []).map(sub =>
                    sub?.id === subtaskId ? { ...sub, completed: !(sub?.completed) } : sub
                );
                const allComplete = updatedSubtasks.length > 0 && updatedSubtasks.every(sub => sub?.completed);
                return { ...task, subtasks: updatedSubtasks, completed: allComplete };
            }
            return task;
        }));
    };

    const toggleExpanded = (taskId) => {
        setTasks(tasks.map(task =>
            task?.id === taskId ? { ...task, expanded: !(task?.expanded) } : task
        ));
    };

    const toggleDocument = (docId) => {
        setDocuments(documents.map(doc =>
            doc?.id === docId ? { ...doc, uploaded: !(doc?.uploaded) } : doc
        ));
    };

    const getDaysUntil = (dateStr) => {
        if (!dateStr || dateStr === 'Not specified') return null;
        const today = new Date();
        const target = new Date(dateStr);
        if (isNaN(target.getTime())) return null;
        const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diff;
    };

    const daysLeft = getDaysUntil(bidDueDateInfo.date);

    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    const uploadedDocs = documents.filter(d => d.uploaded).length;
    const totalDocs = documents.length;

    const InfoModal = ({ item, type, onClose }) => {
        if (!item) return null;

        return (
            <div className="max-h-screen fixed inset-0 bg-[#1E3A5F]/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
                <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-[#4A6785]/20" onClick={e => e.stopPropagation()}>
                    <div className="p-5 border-b border-[#4A6785]/20 flex items-center justify-between bg-gradient-to-r from-[#E8F4F8] to-[#F0F9FC]">
                        <div>
                            <h3 className="text-lg font-bold text-[#1E3A5F]">{item?.name || item?.title || 'Untitled'}</h3>
                            <p className="text-sm text-[#4A6785] mt-1">{item?.sourceSection || ''}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                            <X className="w-5 h-5 text-[#4A6785]" />
                        </button>
                    </div>
                    <div className="p-5 overflow-y-auto max-h-[60vh]">
                        {type === 'document' && item?.instructions && (
                            <div className="mb-4 p-4 bg-[#D4F5E9] border border-[#4A6785]/20 rounded-lg">
                                <div className="font-semibold text-[#1E3A5F] mb-2 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    How to Complete
                                </div>
                                <p className="text-sm text-[#4A6785]">{item.instructions}</p>
                            </div>
                        )}
                        <div className="bg-[#F0F9FC] border border-[#4A6785]/20 rounded-lg p-4">
                            <div className="font-semibold text-[#1E3A5F] mb-2">Source Text from RFQ:</div>
                            <p className="text-sm text-[#4A6785] leading-relaxed italic">"{item?.sourceText || 'No source text available'}"</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return submitted ? (
        <div className="min-h-screen bg-gradient-to-br from-[#E8F4F8] via-[#F0F9FC] to-[#E8F4F8] pt-12">
            {selectedInfo && (
                <InfoModal
                    item={selectedInfo.item}
                    type={selectedInfo.type}
                    onClose={() => setSelectedInfo(null)}
                />
            )}

            {/* 3. HEADER: NOW DYNAMIC */}
            <Header
                mode="dashboard"
                rfpNumber={rfpData?.projectInfo?.rfpNumber}
                title={rfpData?.projectInfo?.title}
                daysLeft={daysLeft}
                dueDate={bidDueDateInfo?.date}
                dueTime={bidDueDateInfo?.time}
                onBackClick={() => setSubmitted(false)}
                onLogoClick={() => window.location.reload(true)}
                rfpData={rfpData}
            />

            <div className="max-w-7xl mx-auto px-6 py-6">
                {/*Warning Message*/}
                <p className="text-red-600 font-bold text-center">Warning: This page will not be saved when you leave. Print/copy your work before leaving if you want to keep it.</p>

                {/* 4. SUMMARY CARDS: NOW DYNAMIC */}
                <div className="flex justify-around md:flex-nowrap flex-wrap mb-6">
                    <div className="bg-white rounded-xl shadow-md p-5 border border-[#4A6785]/20 w-1/3 m-2 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-[#4A6785]">Task Progress</h3>
                            <CheckCircle className="w-5 h-5 text-[#4A6785]" />
                        </div>
                        <div className="text-3xl font-bold text-[#1E3A5F] mb-2">{completedTasks}/{totalTasks}</div>
                        <div className="w-full bg-[#E8F4F8] rounded-full h-2">
                            <div
                                className="bg-[#4A6785] h-2 rounded-full transition-all"
                                style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-5 border border-[#4A6785]/20 w-1/3 m-2 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-[#4A6785]">Documents Ready</h3>
                            <Inbox className="w-5 h-5 text-[#4A6785]" />
                        </div>
                        <div className="text-3xl font-bold text-[#1E3A5F] mb-2">{uploadedDocs}/{totalDocs}</div>
                        <div className="w-full bg-[#E8F4F8] rounded-full h-2">
                            <div
                                className="bg-[#48BB78] h-2 rounded-full transition-all"
                                style={{ width: `${(uploadedDocs / totalDocs) * 100}%` }}
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-5 border border-[#4A6785]/20 w-1/3 m-2 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-[#4A6785]">Contract Value</h3>
                            <DollarSign className="w-5 h-5 text-[#48BB78]" />
                        </div>
                        <div className="text-xl font-bold text-[#1E3A5F] mb-2">{rfpData?.summary?.contractValue || 'N/A'}</div>
                        <div className="text-xs text-[#4A6785]">{rfpData?.summary?.contractDuration || 'Not specified'}</div>
                    </div>

                </div>

                {/* 5. QUALIFICATIONS: NOW DYNAMIC */}
                <div className="bg-[#D4F5E9] border-2 border-[#4A6785]/20 rounded-xl shadow-md mb-6">
                    <div className="p-5">
                        <div className={"flex flex-col justify-between items-center gap-4"}>
                            <div className="flex w-full justify-between items-center gap-4">
                                <div className="flex justify-center items-center gap-4">
                                    <div className="p-3 bg-white rounded-lg shadow-sm">
                                        <AlertCircle className="w-6 h-6 text-[#4A6785]" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-[#1E3A5F]">Required Qualifications & Equipment</h2>
                                        <p className='text-[#4A6785] hover:cursor-pointer hover:text-[#1E3A5F] hover:underline transition-colors' onClick={() => setExpanded(!expanded)}>{expanded ? 'Collapse' : 'Expand for details'}</p>
                                    </div>

                                </div>
                                <div>
                                    <button
                                        onClick={() => setExpanded(!expanded)}
                                        className="float-right p-1 hover:bg-white/50 rounded transition-colors"
                                    >
                                        {expanded ? (
                                            <ChevronUp className="w-5 h-5 text-[#4A6785]" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-[#4A6785]" />
                                        )}
                                    </button></div></div>

                            {expanded && (

                                <div className="grow">
                                    <div className="flex flex-col justify-around flex-wrap gap-6">
                                        {/* Business Qualifications */}
                                        <div>
                                            <h3 className="font-semibold text-[#1E3A5F] mb-3 flex items-center gap-2">
                                                <FileText className="w-4 h-4" />
                                                Business Requirements
                                            </h3>
                                            <div className="space-y-2 text-sm">
                                                {(rfpData?.qualifications?.eligibilityRequirements || []).map((item, idx) => (
                                                    <div key={item?.requirement || idx} className="flex items-start gap-2">
                                                        <div className="w-1.5 h-1.5 bg-[#4A6785] rounded-full mt-1.5 shrink-0" />
                                                        <div>
                                                            <span className="font-medium text-[#1E3A5F]">{item?.requirement || 'N/A'}</span>
                                                            <p className="text-[#4A6785] text-xs">{item?.details || ''}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Insurance Requirements */}
                                        <div>
                                            <h3 className="font-semibold text-[#1E3A5F] mb-3 flex items-center gap-2">
                                                <FileText className="w-4 h-4" />
                                                Insurance Coverage
                                            </h3>
                                            <div className="space-y-2 text-sm">
                                                {(rfpData?.qualifications?.insuranceRequirements || []).map((item, idx) => (
                                                    <div key={item?.type || idx} className="flex items-start gap-2">
                                                        <div className="w-1.5 h-1.5 bg-[#4A6785] rounded-full mt-1.5 shrink-0" />
                                                        <div>
                                                            <span className="font-medium text-[#1E3A5F]">{item?.type || 'N/A'}: {item?.amount || 'N/A'}</span>
                                                            <p className="text-[#4A6785] text-xs">{item?.details || ''}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Equipment Requirements */}
                                        <div>
                                            <h3 className="font-semibold text-[#1E3A5F] mb-3 flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4" />
                                                Required Equipment
                                            </h3>
                                            <div className="space-y-2 text-sm">
                                                {(rfpData?.qualifications?.equipmentRequirements || []).map((item, idx) => (
                                                    <div key={item?.item || idx} className="flex items-start gap-2">
                                                        <div className="w-1.5 h-1.5 bg-[#4A6785] rounded-full mt-1.5 shrink-0" />
                                                        <span className="text-[#1E3A5F]">{item?.item || 'N/A'}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Disqualifiers */}
                                        <div>
                                            <h3 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                                                <X className="w-4 h-4" />
                                                Automatic Disqualifiers
                                            </h3>
                                            <div className="space-y-2 text-sm">
                                                {(rfpData?.disqualifiers || []).map((item, idx) => (
                                                    <div key={item?.reason || idx} className="flex items-start gap-2">
                                                        <X className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                                                        <span className="text-red-800">{item?.reason || 'N/A'}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="flex flex-col justify-around gap-4">


                    {/* 7. PROJECT SUMMARY: NOW DYNAMIC */}
                    <div className="bg-white rounded-xl shadow-md border border-[#4A6785]/20">
                        <div className="p-5 border-b border-[#4A6785]/20 bg-gradient-to-r from-[#E8F4F8] to-[#F0F9FC] rounded-t-xl">
                            <h2 className="text-lg font-bold text-[#1E3A5F] flex items-center gap-2">
                                <InfoIcon className="w-5 h-5" />
                                Project Summary
                            </h2>
                        </div>
                        <div className="p-5 space-y-4 text-lg">
                            <div>
                                <div className="font-semibold text-[#4A6785] mb-1 flex items-center gap-2">
                                    Scope
                                    <button
                                        onClick={() => setSelectedInfo({ item: { name: 'Scope', sourceText: rfpData?.summary?.scope || 'No source text available', sourceSection: rfpData?.summary?.sourceSection || '' }, type: 'summary' })}
                                        className="p-1 hover:bg-[#E8F4F8] rounded transition-colors"
                                        title="View source from RFQ"
                                    >
                                        <FileText className="w-4 h-4 text-[#4A6785]" />
                                    </button>
                                </div>
                                <div className="text-[#1E3A5F]">{rfpData?.summary?.scope || 'No scope information available'}</div>
                            </div>
                            <div>
                                <div className="font-semibold text-[#4A6785] mb-1 flex items-center gap-2">
                                    Locations
                                    <button
                                        onClick={() => setSelectedInfo({ item: { name: 'Locations', sourceText: rfpData?.keyAddresses?.map(a => a.address).join('; ') || 'No source text available', sourceSection: rfpData?.keyAddresses?.[0]?.sourceSection || '' }, type: 'summary' })}
                                        className="p-1 hover:bg-[#E8F4F8] rounded transition-colors"
                                        title="View source from RFQ"
                                    >
                                        <FileText className="w-4 h-4 text-[#4A6785]" />
                                    </button>
                                </div>
                                {rfpData.keyAddresses && (
                                    <ul>
                                        {rfpData.keyAddresses.map((add, idx) => {
                                            return <li className="text-[#1E3A5F] space-y-1 ml-4" key={idx}>{`- ${add.address}`}</li>
                                        })}
                                    </ul>
                                )}

                            </div>
                            <div>
                                <div className="font-semibold text-[#4A6785] mb-1 flex items-center gap-2">
                                    Duration
                                    <button
                                        onClick={() => setSelectedInfo({ item: { name: 'Duration', sourceText: rfpData?.summary?.contractDuration || 'No source text available', sourceSection: rfpData?.summary?.sourceSection || '' }, type: 'summary' })}
                                        className="p-1 hover:bg-[#E8F4F8] rounded transition-colors"
                                        title="View source from RFQ"
                                    >
                                        <FileText className="w-4 h-4 text-[#4A6785]" />
                                    </button>
                                </div>
                                <div className="text-[#1E3A5F]">{rfpData?.summary?.contractDuration || 'Not specified'}</div>
                            </div>
                            <div>
                                <div className="font-semibold text-[#4A6785] mb-1 flex items-center gap-2">
                                    Key Contacts
                                    <button
                                        onClick={() => setSelectedInfo({ item: { name: 'Key Contacts', sourceText: rfpData?.keyContacts?.map(c => `${c.name} - ${c.role}`).join('; ') || 'No source text available', sourceSection: rfpData?.keyContacts?.[0]?.sourceSection || '' }, type: 'keyContacts' })}
                                        className="p-1 hover:bg-[#E8F4F8] rounded transition-colors"
                                        title="View source from RFQ"
                                    >
                                        <FileText className="w-4 h-4 text-[#4A6785]" />
                                    </button>
                                </div>
                                <div className="text-[#1E3A5F] space-y-1">
                                    {rfpData?.keyContacts?.map((contact, idx) => (
                                        <div key={`contact-${idx}`}>{contact.role}: {contact.name} - {contact.contactInfo}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 6. TASK LIST: (Already dynamic, no changes needed) */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-[#4A6785]/20 h-fit">
                        <div className="p-5 border-b border-[#4A6785]/20 bg-gradient-to-r from-[#E8F4F8] to-[#F0F9FC] rounded-t-xl">
                            <h2 className="text-lg font-bold text-[#1E3A5F] flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                Tasks & Deadlines
                            </h2>
                        </div>
                        <div className="p-5 space-y-3 max-h-[600px] overflow-y-auto">
                            {tasks.map(task => {
                                const daysUntil = task?.dueDate ? getDaysUntil(task.dueDate) : 0;
                                const isOverdue = daysUntil < 0;
                                const isUrgent = daysUntil <= 3 && daysUntil >= 0;

                                return (
                                    <div key={task?.id} className="border border-[#4A6785]/20 rounded-lg overflow-hidden">
                                        <div className={`p-4 ${task?.completed ? 'bg-[#D4F5E9]' : 'bg-white'}`}>
                                            <div className="flex items-start gap-3">
                                                <button
                                                    onClick={() => toggleTask(task?.id)}
                                                    className="mt-1 shrink-0"
                                                >
                                                    {task?.completed ? (
                                                        <CheckCircle className="w-5 h-5 text-[#48BB78]" />
                                                    ) : (
                                                        <Circle className="w-5 h-5 text-[#4A6785]" />
                                                    )}
                                                </button>
                                                <div className="grow">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="grow">
                                                            <div className="flex items-center gap-2">
                                                                <h3 className={`font-semibold ${task?.completed ? 'text-[#4A6785] line-through' : 'text-[#1E3A5F]'}`}>
                                                                    {task?.title || 'Untitled Task'}
                                                                </h3>
                                                                <button
                                                                    onClick={() => setSelectedInfo({ item: task, type: 'task' })}
                                                                    className="p-1 hover:bg-[#E8F4F8] rounded transition-colors"
                                                                    title="View source from RFQ"
                                                                >
                                                                    <FileText className="w-4 h-4 text-[#4A6785]" />
                                                                </button>
                                                            </div>
                                                            <div className="flex items-center gap-3 mt-1">
                                                                <span className={`text-xs px-2 py-1 rounded-full ${isOverdue ? 'bg-red-100 text-red-700' :
                                                                    isUrgent ? 'bg-orange-100 text-orange-700' :
                                                                        'bg-[#E8F4F8] text-[#4A6785]'
                                                                    }`}>
                                                                    {isOverdue ? `${Math.abs(daysUntil)} days overdue` :
                                                                        daysUntil === 0 ? 'Due today' :
                                                                            `${daysUntil} days left`}
                                                                </span>
                                                                <span className="text-xs text-[#4A6785]">{task?.dueDate || 'No date'}</span>
                                                                {task?.priority === 'high' && (
                                                                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                                                                        HIGH PRIORITY
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {(task?.subtasks?.length || 0) > 0 && (
                                                            <button
                                                                onClick={() => toggleExpanded(task?.id)}
                                                                className="shrink-0 p-1 hover:bg-[#E8F4F8] rounded transition-colors"
                                                            >
                                                                {task?.expanded ? (
                                                                    <ChevronUp className="w-5 h-5 text-[#4A6785]" />
                                                                ) : (
                                                                    <ChevronDown className="w-5 h-5 text-[#4A6785]" />
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {(task?.subtasks?.length || 0) > 0 && task?.expanded && (
                                            <div className="bg-[#F0F9FC] border-t border-[#4A6785]/20 px-4 py-3">
                                                <div className="space-y-2">
                                                    {(task?.subtasks || []).map(subtask => (
                                                        <div key={subtask?.id} className="flex items-center gap-3">
                                                            <button
                                                                onClick={() => toggleSubtask(task?.id, subtask?.id)}
                                                                className="shrink-0"
                                                            >
                                                                {subtask?.completed ? (
                                                                    <CheckCircle className="w-4 h-4 text-[#48BB78]" />
                                                                ) : (
                                                                    <Circle className="w-4 h-4 text-[#4A6785]" />
                                                                )}
                                                            </button>
                                                            <span className={`text-sm ${subtask?.completed ? 'text-[#4A6785] line-through' : 'text-[#1E3A5F]'}`}>
                                                                {subtask?.title || 'Untitled Subtask'}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>



                    {/* 8. DOCUMENT LIST: (Already dynamic, no changes needed) */}
                    <div className="bg-white rounded-xl shadow-md border border-[#4A6785]/20">
                        <div className="p-5 border-b border-[#4A6785]/20 bg-gradient-to-r from-[#E8F4F8] to-[#F0F9FC] rounded-t-xl">
                            <h2 className="text-lg font-bold text-[#1E3A5F] flex items-center gap-2">
                                <Upload className="w-5 h-5" />
                                Document Checklist
                            </h2>
                        </div>
                        <div className="p-5 space-y-2">
                            {documents.map(doc => (
                                <div
                                    key={doc?.id}
                                    className={`border rounded-lg overflow-hidden ${doc?.uploaded ? 'bg-[#D4F5E9] border-[#48BB78]/30' : 'bg-white border-[#4A6785]/20'
                                        }`}
                                >
                                    <div className="flex items-center justify-between p-3">
                                        <div className="flex items-center gap-3 grow">
                                            <button
                                                onClick={() => toggleDocument(doc?.id)}
                                            >
                                                {doc?.uploaded ? (
                                                    <CheckCircle className="w-5 h-5 text-[#48BB78]" />
                                                ) : (
                                                    <Circle className="w-5 h-5 text-[#4A6785]" />
                                                )}
                                            </button>
                                            <div className="grow">
                                                <div className="flex items-center gap-2">
                                                    <div className={`text-lg font-medium ${doc?.uploaded ? 'text-[#4A6785]' : 'text-[#1E3A5F]'}`}>
                                                        {doc?.name || 'Untitled Document'}
                                                    </div>
                                                    <button
                                                        onClick={() => setSelectedInfo({ item: doc, type: 'document' })}
                                                        className="p-1 hover:bg-[#E8F4F8] rounded transition-colors"
                                                        title="View instructions and source"
                                                    >
                                                        <FileText className="w-4 h-4 text-[#4A6785]" />
                                                    </button>
                                                </div>
                                                {doc?.required && !doc?.uploaded && (
                                                    <div className="text-sm text-red-600 mt-0.5">Required</div>
                                                )}
                                                {doc?.instructions && (
                                                    <div className="text-sm text-[#4A6785] mt-1 line-clamp-2">
                                                        {doc.instructions}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {!doc?.uploaded && (
                                            <button className="p-2 hover:bg-[#E8F4F8] rounded-lg transition-colors shrink-0">
                                                <Upload className="w-4 h-4 text-[#4A6785]" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    ) : (
        <div className="bg-gradient-to-br from-[#E8F4F8] via-[#F0F9FC] to-[#E8F4F8fa]">
            <Header mode="landing" />
            <div className="min-h-screen flex items-center justify-center p-6 pt-24">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-2xl shadow-[#4A6785]/30 border border-[#4A6785]/20 p-8 max-w-2xl w-full">

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center gap-6 py-12">
                            <div className="p-6 bg-[#D4F5E9] rounded-full">
                                <Loader2 className="w-16 h-16 text-[#4A6785] animate-spin" />
                            </div>
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-[#1E3A5F] mb-2">Submitting Your Proposal...</h2>
                                <p className="text-[#4A6785]">Please wait while we process your submission</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-6">
                            <div className="p-4 bg-[#D4F5E9] rounded-full">
                                <Upload className="w-8 h-8 text-[#4A6785]" />
                            </div>
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-[#1E3A5F] mb-2">Upload a Proposal/Quote</h2>
                                <p className="text-[#4A6785] mb-2">Upload an RFP or RFQ in its entirety</p>
                            </div>

                            <div className="text-center border-2 border-[#4A6785]/30 p-4 rounded-xl text-[#1E3A5F] bg-[#D4F5E9]">
                                <p>This application is currently linked to a lost-cost tier of OpenAI's API. </p>
                                <p>In order to reduce costs for this MVP, API calls are being limited.</p>
                                <p className="mt-2">As a result, your attempt may fail if too many API calls have been made.</p>
                                <br></br>
                                <p className="font-semibold">Please click "View Demo Analysis" below to see the results of the AI analysis completed during HackMemphis 2025.</p>
                                <div className="flex items-center justify-center gap-2 mt-2">
                                    <FileText className="w-4 h-4 text-[#4A6785]" />
                                    <a
                                        href="/demo_rfp.pdf"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#4A6785] font-semibold hover:underline text-sm"
                                    >
                                        View PDF from Demo Analysis
                                    </a>
                                </div>

                            </div>
                            
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                className="w-xs md:w-sm text-sm text-[#4A6785] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#4A6785] file:text-white hover:file:bg-[#1E3A5F] border-2 border-dashed border-[#4A6785]/30 rounded-xl p-4 bg-[#F0F9FC]/50 cursor-pointer transition-all"
                            />
                            <button
                                onClick={processFile}
                                className="w-full md:w-sm border-2 border-[#4A6785] bg-[#4A6785] hover:bg-[#1E3A5F] text-white font-semibold py-4 px-8 rounded-xl transition-colors text-lg shadow-lg hover:shadow-xl"
                            >
                                Analyze your own RFP/RFQ!
                            </button>
                            <p className="text-center text-[#4A6785] mt-2 italic">subject to API availability</p>
                            <hr className="my-4 border-[#4A6785] border w-1/8 " />
                            <button
                                onClick={fakeSubmit}
                                className="w-full border-2 border-[#4A6785] bg-[#D4F5E9] hover:bg-[#1E3A5F] text-[#4A6785] font-semibold py-4 px-8 rounded-xl transition-colors text-lg shadow-lg hover:text-white hover:shadow-xl"
                            >
                                View Demo Analysis
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
};

export default RFPDashboard;