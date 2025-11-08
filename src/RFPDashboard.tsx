// @ts-nocheck
import React, { useState } from 'react';
import { CheckCircle, Circle, Upload, AlertCircle, Clock, DollarSign, MapPin, FileText, ChevronDown, ChevronUp, Info, X, Inbox } from 'lucide-react';
import rfpData from '../rfp_data' // <-- 1. IMPORT THE DATA

const RFPDashboard = () => {
    const [selectedInfo, setSelectedInfo] = useState(null);
    const [expanded, setExpanded] = useState(false);
    // 2. INITIALIZE STATE FROM THE IMPORTED JSON
    const [tasks, setTasks] = useState(rfpData?.tasks || []);
    const [documents, setDocuments] = useState(rfpData?.requiredDocuments || []);

    // Find the Bid Due Date from the imported data
    const bidDueDateInfo = rfpData?.keyDates?.find(d => d.event === 'Bid Due Date') || { date: '2025-11-19', time: '12:00 PM CT' };

    const toggleTask = (taskId) => {
        setTasks(tasks.map(task =>
            task?.id === taskId ? { ...task, completed: !(task?.completed) } : task
        ));
    };

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

    // This function is still hardcoded for the demo date, which is fine.
    const getDaysUntil = (dateStr) => {
        const today = new Date('2025-11-08'); // Demo date
        const target = new Date(dateStr);
        const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
                    <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">{item?.name || item?.title || 'Untitled'}</h3>
                            <p className="text-sm text-slate-800 mt-1">{item?.sourceSection || ''}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                            <X className="w-5 h-5 text-slate-800" />
                        </button>
                    </div>
                    <div className="p-5 overflow-y-auto max-h-[60vh]">
                        {type === 'document' && item?.instructions && (
                            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    How to Complete
                                </div>
                                <p className="text-sm text-blue-800">{item.instructions}</p>
                            </div>
                        )}
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                            <div className="font-semibold text-slate-700 mb-2">Source Text from RFQ:</div>
                            <p className="text-sm text-slate-800 leading-relaxed italic">"{item?.sourceText || 'No source text available'}"</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#00698B90]">
            {selectedInfo && (
                <InfoModal
                    item={selectedInfo.item}
                    type={selectedInfo.type}
                    onClose={() => setSelectedInfo(null)}
                />
            )}

            {/* 3. HEADER: NOW DYNAMIC */}
            <div className="bg-yellow-400 border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">RFQ #{rfpData?.projectInfo?.rfpNumber || 'N/A'}</h1>
                            <p className="text-slate-800">{rfpData?.projectInfo?.title || 'No title available'}</p>
                        </div>
                        <div className="text-right p-2 bg-yellow-200 rounded-sm">
                            <div className="text-3xl font-bold text-red-600">{daysLeft} DAYS</div>
                            <div className="text-sm text-slate-800">Until Submission</div>
                            <div className="text-xs text-slate-800 mt-1">Due: {bidDueDateInfo?.date || 'N/A'} @ {bidDueDateInfo?.time || 'N/A'}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-6">

                {/* 4. SUMMARY CARDS: NOW DYNAMIC */}
                <div className="flex justify-around mb-6">
                <div className="bg-white rounded-lg shadow-sm p-5 border border-slate-200 w-1/3 m-2">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-slate-700">Upload Document</h3>
                            <FileText className="w-5 h-5 text-black-500" />
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-2">{completedTasks}/{totalTasks}</div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                                className="bg-blue-500 h-2 rounded-full transition-all"
                                style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                            />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-5 border border-slate-200 w-1/3 m-2">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-slate-700">Task Progress</h3>
                            <CheckCircle className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-2">{completedTasks}/{totalTasks}</div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                                className="bg-blue-500 h-2 rounded-full transition-all"
                                style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-5 border border-slate-200 w-1/3 m-2">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-slate-700">Documents Ready</h3>
                            <Inbox className="w-5 h-5 text-purple-500" />
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-2">{uploadedDocs}/{totalDocs}</div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                                className="bg-green-500 h-2 rounded-full transition-all"
                                style={{ width: `${(uploadedDocs / totalDocs) * 100}%` }}
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-5 border border-slate-200 w-1/3 m-2">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-slate-700">Contract Value</h3>
                            <DollarSign className="w-5 h-5 text-green-500" />
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-2">{rfpData?.summary?.contractValue || 'N/A'}</div>
                        <div className="text-xs text-slate-800">{rfpData?.summary?.contractDuration || 'Not specified'}</div>
                    </div>

                </div>

                {/* 5. QUALIFICATIONS: NOW DYNAMIC */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg shadow-sm mb-6">
                    <div className="p-5">
                        <div className={"flex flex-col justify-between items-center gap-4"}>
                            <div className="flex w-full justify-between items-center gap-4">
                                <div className="flex justify-center items-center gap-4">
                                    <div className="p-3 bg-amber-100 rounded-lg">
                                        <AlertCircle className="w-6 h-6 text-amber-700" />
                                    </div>
                                    <h2 className="text-lg font-bold text-amber-900">Required Qualifications & Equipment</h2>

                                </div>
                                <div>
                                    <button
                                        onClick={() => setExpanded(!expanded)}
                                        className="float-right p-1 hover:bg-slate-100 rounded"
                                    >
                                        {expanded ? (
                                            <ChevronUp className="w-5 h-5 text-slate-800" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-slate-800" />
                                        )}
                                    </button></div></div>

                            {expanded && (

                                <div className="flex-grow">
                                    <div className="flex flex-col justify-around flex-wrap gap-6">
                                        {/* Business Qualifications */}
                                        <div>
                                            <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                                                <FileText className="w-4 h-4" />
                                                Business Requirements
                                            </h3>
                                            <div className="space-y-2 text-sm">
                                                {(rfpData?.qualifications?.eligibilityRequirements || []).map((item, idx) => (
                                                    <div key={item?.requirement || idx} className="flex items-start gap-2">
                                                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-1.5 flex-shrink-0" />
                                                        <div>
                                                            <span className="font-medium text-amber-900">{item?.requirement || 'N/A'}</span>
                                                            <p className="text-amber-700 text-xs">{item?.details || ''}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Insurance Requirements */}
                                        <div>
                                            <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                                                <FileText className="w-4 h-4" />
                                                Insurance Coverage
                                            </h3>
                                            <div className="space-y-2 text-sm">
                                                {(rfpData?.qualifications?.insuranceRequirements || []).map((item, idx) => (
                                                    <div key={item?.type || idx} className="flex items-start gap-2">
                                                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-1.5 flex-shrink-0" />
                                                        <div>
                                                            <span className="font-medium text-amber-900">{item?.type || 'N/A'}: {item?.amount || 'N/A'}</span>
                                                            <p className="text-amber-700 text-xs">{item?.details || ''}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Equipment Requirements */}
                                        <div>
                                            <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4" />
                                                Required Equipment
                                            </h3>
                                            <div className="space-y-2 text-sm">
                                                {(rfpData?.qualifications?.equipmentRequirements || []).map((item, idx) => (
                                                    <div key={item?.item || idx} className="flex items-start gap-2">
                                                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-1.5 flex-shrink-0" />
                                                        <span className="text-amber-900">{item?.item || 'N/A'}</span>
                                                    </div>
                                                ))}
                                                <p className="text-xs text-amber-700 italic mt-3 pl-4">
                                                    ⚠️ All equipment must be physically inspected after selection. Missing equipment = disqualification.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Disqualifiers */}
                                        <div>
                                            <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                                                <X className="w-4 h-4" />
                                                Automatic Disqualifiers
                                            </h3>
                                            <div className="space-y-2 text-sm">
                                                {(rfpData?.disqualifiers || []).map((item, idx) => (
                                                    <div key={item?.reason || idx} className="flex items-start gap-2">
                                                        <X className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                                        <span className="text-red-900">{item?.reason || 'N/A'}</span>
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
                        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
                            <div className="p-5 border-b border-slate-200">
                                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5" />
                                    Project Summary
                                </h2>
                            </div>
                            <div className="p-5 space-y-4 text-sm">
                                <div>
                                    <div className="font-semibold text-slate-700 mb-1">Scope</div>
                                    <div className="text-slate-800">{rfpData?.summary?.scope || 'No scope information available'}</div>
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-700 mb-1 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        Locations
                                    </div>
                                    <div className="text-slate-800 space-y-1">

                                    </div>
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-700 mb-1">Duration</div>
                                    <div className="text-slate-800">{rfpData?.summary?.contractDuration || 'Not specified'}</div>
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-700 mb-1">Key Requirements</div>
                                    <div className="text-slate-800 space-y-1">
                                        <div>✓ Mandatory site visits</div>
                                        <div>✓ Commercial-grade equipment</div>
                                        <div>✓ Equipment inspection after selection</div>
                                        <div>✓ Minimum 2 years experience</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    {/* 6. TASK LIST: (Already dynamic, no changes needed) */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200 h-fit">
                        <div className="p-5 border-b border-slate-200">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
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
                                    <div key={task?.id} className="border border-slate-200 rounded-lg overflow-hidden">
                                        <div className={`p-4 ${task?.completed ? 'bg-green-50' : 'bg-white'}`}>
                                            <div className="flex items-start gap-3">
                                                <button
                                                    onClick={() => toggleTask(task?.id)}
                                                    className="mt-1 flex-shrink-0"
                                                >
                                                    {task?.completed ? (
                                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                                    ) : (
                                                        <Circle className="w-5 h-5 text-slate-400" />
                                                    )}
                                                </button>
                                                <div className="flex-grow">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="flex-grow">
                                                            <div className="flex items-center gap-2">
                                                                <h3 className={`font-semibold ${task?.completed ? 'text-slate-800 line-through' : 'text-slate-900'}`}>
                                                                    {task?.title || 'Untitled Task'}
                                                                </h3>
                                                                <button
                                                                    onClick={() => setSelectedInfo({ item: task, type: 'task' })}
                                                                    className="p-1 hover:bg-slate-200 rounded transition-colors"
                                                                    title="View source from RFQ"
                                                                >
                                                                    <Info className="w-4 h-4 text-blue-600" />
                                                                </button>
                                                            </div>
                                                            <div className="flex items-center gap-3 mt-1">
                                                                <span className={`text-xs px-2 py-1 rounded-full ${isOverdue ? 'bg-red-100 text-red-700' :
                                                                        isUrgent ? 'bg-orange-100 text-orange-700' :
                                                                            'bg-blue-100 text-blue-700'
                                                                    }`}>
                                                                    {isOverdue ? `${Math.abs(daysUntil)} days overdue` :
                                                                        daysUntil === 0 ? 'Due today' :
                                                                            `${daysUntil} days left`}
                                                                </span>
                                                                <span className="text-xs text-slate-800">{task?.dueDate || 'No date'}</span>
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
                                                                className="flex-shrink-0 p-1 hover:bg-slate-100 rounded"
                                                            >
                                                                {task?.expanded ? (
                                                                    <ChevronUp className="w-5 h-5 text-slate-800" />
                                                                ) : (
                                                                    <ChevronDown className="w-5 h-5 text-slate-800" />
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {(task?.subtasks?.length || 0) > 0 && task?.expanded && (
                                            <div className="bg-slate-50 border-t border-slate-200 px-4 py-3">
                                                <div className="space-y-2">
                                                    {(task?.subtasks || []).map(subtask => (
                                                        <div key={subtask?.id} className="flex items-center gap-3">
                                                            <button
                                                                onClick={() => toggleSubtask(task?.id, subtask?.id)}
                                                                className="flex-shrink-0"
                                                            >
                                                                {subtask?.completed ? (
                                                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                                                ) : (
                                                                    <Circle className="w-4 h-4 text-slate-400" />
                                                                )}
                                                            </button>
                                                            <span className={`text-sm ${subtask?.completed ? 'text-slate-800 line-through' : 'text-slate-700'}`}>
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
                        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
                            <div className="p-5 border-b border-slate-200">
                                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Upload className="w-5 h-5" />
                                    Document Checklist
                                </h2>
                            </div>
                            <div className="p-5 space-y-2 max-h-[400px] overflow-y-auto">
                                {documents.map(doc => (
                                    <div
                                        key={doc?.id}
                                        className={`border rounded-lg overflow-hidden ${doc?.uploaded ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between p-3">
                                            <div className="flex items-center gap-3 flex-grow">
                                                <button
                                                    onClick={() => toggleDocument(doc?.id)}
                                                >
                                                    {doc?.uploaded ? (
                                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                                    ) : (
                                                        <Circle className="w-5 h-5 text-slate-400" />
                                                    )}
                                                </button>
                                                <div className="flex-grow">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`text-sm font-medium ${doc?.uploaded ? 'text-slate-800' : 'text-slate-900'}`}>
                                                            {doc?.name || 'Untitled Document'}
                                                        </div>
                                                        <button
                                                            onClick={() => setSelectedInfo({ item: doc, type: 'document' })}
                                                            className="p-1 hover:bg-slate-200 rounded transition-colors"
                                                            title="View instructions and source"
                                                        >
                                                            <Info className="w-4 h-4 text-blue-600" />
                                                        </button>
                                                    </div>
                                                    {doc?.required && !doc?.uploaded && (
                                                        <div className="text-xs text-red-600 mt-0.5">Required</div>
                                                    )}
                                                    {doc?.instructions && (
                                                        <div className="text-xs text-slate-800 mt-1 line-clamp-1">
                                                            {doc.instructions}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {!doc?.uploaded && (
                                                <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors flex-shrink-0">
                                                    <Upload className="w-4 h-4 text-slate-800" />
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
    );
};

export default RFPDashboard;