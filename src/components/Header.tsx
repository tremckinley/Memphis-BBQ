import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
    /** Display mode: 'landing' for homepage, 'dashboard' for post-submission view */
    mode: 'landing' | 'dashboard';
    /** RFP number to display (dashboard mode only) */
    rfpNumber?: string;
    /** RFP title to display (dashboard mode only) */
    title?: string;
    /** Days remaining until submission (dashboard mode only) */
    daysLeft?: number;
    /** Bid due date string (dashboard mode only) */
    dueDate?: string;
    /** Bid due time string (dashboard mode only) */
    dueTime?: string;
    /** Callback for back button click (dashboard mode only) */
    onBackClick?: () => void;
    /** Callback for logo click (dashboard mode only) */
    onLogoClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
    mode,
    rfpNumber,
    title,
    daysLeft,
    dueDate,
    dueTime,
    onBackClick,
    onLogoClick
}) => {
    if (mode === 'landing') {
        return (
            <div className="bg-gradient-to-r from-[#E8F4F8] to-[#F0F9FC] shadow-lg shadow-slate-300 fixed z-100 top-0 w-full h-24 border-b border-[#4A6785]/20">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-center">
                        <img
                            src='/icon.png'
                            height={"80px"}
                            width={"80px"}
                            className='p-1'
                        />
                        <div className='text-3xl font-bold ml-2 text-[#1E3A5F]'>Memphis B.B.Q. AI</div>
                    </div>
                </div>
            </div>
        );
    }

    // Dashboard mode
    return (
        <div className="bg-gradient-to-r from-[#E8F4F8] to-[#F0F9FC] shadow-lg shadow-slate-300 border-b border-[#4A6785]/20">
            <span
                className="flex items-center pt-2 pl-12 text-[#4A6785] hover:text-[#1E3A5F] cursor-pointer transition-colors"
                onClick={onBackClick}
            >
                <ArrowLeft /> Back to Homepage
            </span>
            <div className="max-w-7xl mx-auto">
                <div className="md:flex-row flex flex-col items-center md:justify-between">
                    <div className='flex items-center'>
                        <div className='px-4'>
                            <h1 className="text-center md:text-left lg:text-2xl text-lg font-bold text-[#1E3A5F]">
                                RFQ #{rfpNumber || 'N/A'}
                            </h1>
                            <p className="text-[#4A6785] text-sm lg:text-base">
                                {title || 'No title available'}
                            </p>
                        </div>
                    </div>
                    <img
                        src='/icon.png'
                        height={"80px"}
                        width={"80px"}
                        className='mr-4 cursor-pointer hover:opacity-80 transition-opacity'
                        onClick={onLogoClick}
                    />
                    <div className="md:text-right text-center p-3 bg-[#D4F5E9] rounded-lg border border-[#4A6785]/20 m-2">
                        <div className="text-2xl font-bold text-[#1E3A5F]">{daysLeft} DAYS</div>
                        <div className="text-sm text-[#4A6785]">Until Submission</div>
                        <div className="text-xs text-[#4A6785] mt-1">
                            Due: {dueDate || 'N/A'} @ {dueTime || 'N/A'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
