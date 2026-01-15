export default function AboutSection() {

    const handleScrollToUpload = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const uploadForm = document.getElementById('upload-form');
        if (uploadForm) {
            const headerOffset = 100; // Account for fixed header (h-24 = 96px + padding)
            const top = uploadForm.getBoundingClientRect().top + window.scrollY - headerOffset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    };

    return (
        <div className="flex flex-col items-center  gap-8 w-full min-h-screen pb-12">
            <div className="flex flex-col items-center justify-center gap-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl shadow-[#4A6785]/30 border border-[#4A6785]/20 p-10 max-w-2xl w-full transition-all hover:shadow-3xl">
                {/* Logo with subtle glow effect */}
                <div className="p-4">
                    <img
                        src="/icon_128.png"
                        alt="Memphis BBQ Logo"
                        height={96}
                        width={96}
                        className="drop-shadow-md"
                    />
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-[#1E3A5F] text-center tracking-tight">
                    About Memphis B.B.Q.
                </h2>

                {/* Main description */}
                <p className="text-[#4A6785] text-center text-lg leading-relaxed">
                    Memphis B.B.Q. is a web application that helps you analyze RFPs (Request for Proposals) for government contracts.
                </p>

                {/* Highlighted callout */}
                <div className="bg-gradient-to-r from-[#D4F5E9] to-[#E8F4F8] border border-[#4A6785]/20 rounded-xl p-5 w-full">
                    <p className="text-[#1E3A5F] text-center font-semibold text-lg">
                        Small Business Owners need clarity in common language, as quickly as possible.
                    </p>
                </div>

                {/* Detailed explanation */}
                <p className="text-[#4A6785] text-center leading-relaxed">
                    Memphis BBQ helps small business owners decode complex government procurement documents by using AI to extract deadlines, requirements, disqualifiers, and submission checklists into a clear, actionable dashboard.
                </p>

                {/* CTA Button */}
                <button
                    onClick={handleScrollToUpload}
                    className="w-full bg-[#4A6785] hover:bg-[#1E3A5F] text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                >
                    Get Started
                </button>
            </div>
        </div>
    );
}