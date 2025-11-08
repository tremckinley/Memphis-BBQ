// @ts-nocheck
import React, { useState } from 'react';
import { CheckCircle, Circle, Upload, AlertCircle, Clock, DollarSign, MapPin, FileText, ChevronDown, ChevronUp, Info, X } from 'lucide-react';

const RFPDashboard = () => {
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Site Visits (MANDATORY)',
      dueDate: '2025-11-18',
      priority: 'high',
      completed: false,
      sourceText: 'SITE VISITS: Site Visits are mandatory and required prior to the bid submission to understand each site\'s needs (such as the necessity for turf upkeep, knowledge of each zone\'s acreage, designated places for trash, shrubbery, etc.). The site visits must be completed on your own time; they are not scheduled by the Parks division. Bidders for each zone location must sign the site visit form, and it must be submitted with your bid. Bids will not be considered unless the site visit form is included.',
      sourceSection: 'Section 2.2, Item 9',
      subtasks: [
        { id: 11, title: 'Visit Gaisman Park (4221 Macon)', completed: false },
        { id: 12, title: 'Visit Lester Park (317 Tillman)', completed: false },
        { id: 13, title: 'Visit Skinner Park (712 Tanglewood)', completed: false },
        { id: 14, title: 'Visit Glenview Park (1141 S. Barksdale)', completed: false },
        { id: 15, title: 'Visit Orange Mound Park (2572 Park)', completed: false },
        { id: 16, title: 'Visit Davis Park (3371 Spottswood)', completed: false },
        { id: 17, title: 'Complete Site Visit Form', completed: false }
      ],
      expanded: true
    },
    {
      id: 2,
      title: 'Equipment Documentation',
      dueDate: '2025-11-18',
      priority: 'high',
      completed: false,
      sourceText: 'Submission of Equipment List. All bidders must submit a comprehensive and itemized list of all equipment intended for use on this project as an attachment to their bid. The list must detail each piece of equipment by manufacturer, model, and serial number (if applicable)... During the mandatory equipment inspection, which will be done after the vendor is chosen, but the award is contingent upon inspection, and if any piece of equipment listed in the bid proposal is not available or cannot be demonstrated to be in the bidder\'s possession, the bidder\'s submission will be deemed non-responsive.',
      sourceSection: 'Section 2.2, Items 6-8',
      subtasks: [
        { id: 21, title: 'List all tractors (mfg, model, serial)', completed: false },
        { id: 22, title: 'List all mowers (mfg, model, serial)', completed: false },
        { id: 23, title: 'List blowers & weed eaters', completed: false },
        { id: 24, title: 'List hand tools & supplies', completed: false },
        { id: 25, title: 'Verify equipment insurance', completed: false }
      ],
      expanded: false
    },
    {
      id: 3,
      title: 'References & Experience',
      dueDate: '2025-11-15',
      priority: 'medium',
      completed: false,
      sourceText: 'REVELANT EXPERIENCE AND REFERENCES: Please describe agency\'s relevant experience as it relates to this project. Respondents must have a minimum of two (2) years of experience or equivalent. Discuss your firm\'s capabilities, experience, and qualifications to perform the required services. Proposer must include copies of Licenses and Certifications (if required). Provide at least three references to include name of company, address, point of contact and phone number from previous jobs.',
      sourceSection: 'Section 3.7',
      subtasks: [
        { id: 31, title: 'Request reference letter from Client 1', completed: false },
        { id: 32, title: 'Request reference letter from Client 2', completed: false },
        { id: 33, title: 'Request reference letter from Client 3', completed: false },
        { id: 34, title: 'Compile verifiable client list', completed: false },
        { id: 35, title: 'Write company experience summary', completed: false }
      ],
      expanded: false
    },
    {
      id: 4,
      title: 'Pricing Calculation',
      dueDate: '2025-11-17',
      priority: 'high',
      completed: false,
      sourceText: 'PRICING: Please REFER to the form in Exhibit F. (Please use the x-cel version for Exhibit F). The Bid and price sheet (in Excel format, attached to the bid) must be filled out by each bidder: The total annual amount and corresponding monthly costs must be provided on the bid & price sheet.',
      sourceSection: 'Section 3.5 & 2.2, Item 14',
      subtasks: [
        { id: 41, title: 'Calculate mowing cost per acre', completed: false },
        { id: 42, title: 'Calculate weed-eating cost per acre', completed: false },
        { id: 43, title: 'Calculate mulching cost per acre', completed: false },
        { id: 44, title: 'Calculate hardscape maintenance cost', completed: false },
        { id: 45, title: 'Complete Exhibit F pricing sheet', completed: false }
      ],
      expanded: false
    },
    {
      id: 5,
      title: 'Required Forms & Documents',
      dueDate: '2025-11-18',
      priority: 'high',
      completed: false,
      sourceText: 'PROPOSAL RESPONSE: This Section describes the contents of Proposer\'s Proposal and provides an outline of how the Proposer should organize it. Proposer\'s Proposal will not be considered responsive unless it fully complies with the requirements in this Section. Specifically, Proposer\'s Proposal shall include each of the sections referenced: Section 1 – Cover Letter, Section 2 – Non-Collusion Affidavit, Section 3 – Criminal and Civil Proceedings Disclosure, Section 4 – Pricing, Section 5 – Relevant Experience.',
      sourceSection: 'Section 3',
      subtasks: [
        { id: 51, title: 'Sign Cover Letter (Exhibit E)', completed: false },
        { id: 52, title: 'Notarize Non-Collusion Affidavit (Exhibit D)', completed: false },
        { id: 53, title: 'Complete Criminal/Civil Disclosure (Exhibit C)', completed: false },
        { id: 54, title: 'Sign Drug Free Workplace Certificate (Exhibit A)', completed: false }
      ],
      expanded: false
    },
    {
      id: 6,
      title: 'Submit Questions (Optional)',
      dueDate: '2025-10-29',
      priority: 'low',
      completed: false,
      sourceText: 'SUBMISSION OF QUESTIONS: Proposer may submit an initial set of questions based on its review of this RFQ, by adhering to the format template provided in (8.7 Exhibit G, Questions) and submitted as an attached WORD document or as part of the body of the email (no pdf documents) and sending it via email by 5:00 pm CST on the date listed in Section 4.2 "Schedule of Activities". Questions received after this time and date will not be answered.',
      sourceSection: 'Section 4.3',
      subtasks: [],
      expanded: false
    },
    {
      id: 7,
      title: 'Final Submission Prep',
      dueDate: '2025-11-19',
      priority: 'high',
      completed: false,
      sourceText: 'PROPOSAL SUBMISSION: Proposer shall submit, in a sealed packet, one (1) original (clearly marked on the outside of the binder as "ORIGINAL"), two (2) complete printed copies, and one (1) thumb drives containing softcopies of its entire Proposal (including the signed Cover Letters) on or before the date specified in Section 4.2 Schedule of Activities no later than 12:00 noon CT.',
      sourceSection: 'Section 4.4',
      subtasks: [
        { id: 71, title: 'Print 1 original + 2 copies', completed: false },
        { id: 72, title: 'Create thumb drive with all docs', completed: false },
        { id: 73, title: 'Label envelope correctly', completed: false },
        { id: 74, title: 'Deliver by 12:00 PM CT', completed: false }
      ],
      expanded: false
    }
  ]);

  const [documents, setDocuments] = useState([
    { 
      id: 1, 
      name: 'Site Visit Form', 
      required: true, 
      uploaded: false,
      instructions: 'Visit each of the 6 parks listed. Complete the form on page 15 of the RFQ with vendor name, date, zone location, and signatures. This must be submitted with your bid.',
      sourceText: 'Vendors must tour the designated areas and acknowledge their understanding of the required ground maintenance acreage for the Memphis Park Operations Department. All correspondents for this RFQ must complete the attached site visit form.',
      sourceSection: 'Page 15 - Site Visit Form'
    },
    { 
      id: 2, 
      name: 'Equipment List', 
      required: true, 
      uploaded: false,
      instructions: 'Create a comprehensive itemized list of all equipment. Include manufacturer, model, and serial number for each piece. Cover tractors, mowers, blowers, weed eaters, and hand tools.',
      sourceText: 'All bidders must submit a comprehensive and itemized list of all equipment intended for use on this project as an attachment to their bid. The list must detail each piece of equipment by manufacturer, model, and serial number (if applicable).',
      sourceSection: 'Section 2.2, Item 6'
    },
    { 
      id: 3, 
      name: 'Pricing Schedule (Exhibit F)', 
      required: true, 
      uploaded: false,
      instructions: 'Use the Excel version of Exhibit F. Fill in unit prices for each service (mowing, weed-eating, blowing, etc.) per acre for 19 total acres. Include annual total and monthly breakdown. Sign and date.',
      sourceText: 'The Bid and price sheet (in Excel format, attached to the bid) must be filled out by each bidder: The total annual amount and corresponding monthly costs must be provided on the bid & price sheet.',
      sourceSection: 'Section 2.2, Item 14 & Exhibit F'
    },
    { 
      id: 4, 
      name: 'Cover Letter (Exhibit E)', 
      required: true, 
      uploaded: false,
      instructions: 'Use Exhibit E template. Include your company name, address, phone, email, and authorized representative. Sign and date. Acknowledge understanding of RFQ requirements.',
      sourceText: 'Proposer\'s Proposal shall contain a cover letter acknowledging Proposer\'s understanding of the RFQ process and requirements set forth in this RFQ, including its commitment to its Proposal. The cover letter shall be signed by an authorized representative of Proposer\'s company.',
      sourceSection: 'Section 3.1 & Exhibit E'
    },
    { 
      id: 5, 
      name: 'Non-Collusion Affidavit (Exhibit D)', 
      required: true, 
      uploaded: false,
      instructions: 'Complete Exhibit D form. Certify no collusion with other bidders. Must be signed by authorized representative AND notarized with official seal.',
      sourceText: 'The Proposer, by its officers and its agents or representatives present at the time of filing this Proposal, being duly sworn on their oaths say, that neither they nor any of them have in any way, directly or indirectly, entered into any arrangement or agreement with any other Proposer... [Must be notarized]',
      sourceSection: 'Exhibit D'
    },
    { 
      id: 6, 
      name: 'Criminal/Civil Disclosure (Exhibit C)', 
      required: true, 
      uploaded: false,
      instructions: 'Use Exhibit C form. Describe all ongoing and past civil/criminal proceedings within last 10 years. If none, indicate "None" and return with proposal. Be thorough - undisclosed issues can disqualify you.',
      sourceText: 'Describe all ongoing and past civil and criminal proceedings and investigations within the last 10 years. Indicate the status of current proceeding/investigations and the outcome of closed or completed actions. The City reserves the right to disqualify any vendor who does not disclose information that is discovered by the City after the vendor\'s submission.',
      sourceSection: 'Exhibit C'
    },
    { 
      id: 7, 
      name: 'Drug Free Workplace (Exhibit A)', 
      required: true, 
      uploaded: false,
      instructions: 'Complete Exhibit A certificate. Acknowledge adherence to City\'s drug-free workplace policy. Include contractor name, date, and authorized signature with printed name/title.',
      sourceText: 'As A Contractor on a City of Memphis contract, the undersigned states that it acknowledges and adheres to the City of Memphis Drug Free Workplace policy and if awarded a contract for this project, agrees in performance of work to require drug and alcohol screening in specified situations.',
      sourceSection: 'Exhibit A'
    },
    { 
      id: 8, 
      name: 'Reference Letters (3)', 
      required: true, 
      uploaded: false,
      instructions: 'Obtain 3 reference letters from clients with similar scale operations. Letters must be on company letterhead and include contact information. References should speak to your grounds maintenance capabilities.',
      sourceText: 'Vendor must provide 3 written customer recommendations from clients with a similar scale of operations. Recommendations must be on the company letterhead with the included contact information.',
      sourceSection: 'Section 3.7 & Exhibit H'
    },
    { 
      id: 9, 
      name: 'Client List', 
      required: true, 
      uploaded: false,
      instructions: 'Create a list of verifiable clients. Include company names, contacts, phone numbers, and addresses. Submit in PDF or printed format. Focus on grounds maintenance projects.',
      sourceText: 'Vendor must also provide a list of verifiable clients, submitted in PDF or printed format. Provide at least three references to include name of company, address, point of contact and phone number from previous jobs.',
      sourceSection: 'Section 3.7 & Exhibit H'
    },
    { 
      id: 10, 
      name: 'Insurance Certificates', 
      required: true, 
      uploaded: false,
      instructions: 'Obtain certificates showing Workers Comp, Auto Liability ($1M), General Liability ($1M per occurrence), and Umbrella ($1M). City of Memphis must be named as additional insured. Certificate holder: City of Memphis, Attn: Risk Management, 170 N. Main St., 5th Floor, Memphis, TN 38103.',
      sourceText: 'The Company shall not commence any work under this contract until it has obtained all required insurance. Certificate Holder: City of Memphis, Attn: Risk Management, 170 N. Main St., 5th Floor, Memphis, TN. 38103. The City of Memphis, its officials, agents, employees and representatives shall be named as additional insured.',
      sourceSection: 'Exhibit B-1'
    },
    { 
      id: 11, 
      name: 'Business License', 
      required: true, 
      uploaded: false,
      instructions: 'If your business is located within Memphis city limits, provide current Memphis and Shelby County Business Tax Receipt/License. If you\'re a 501(c)(3) nonprofit, provide IRS tax-exempt determination letter instead.',
      sourceText: 'Pursuant to the City of Memphis Charter, Article 71, Section 777 et seq., it is unlawful to operate a business within the limits of the city of Memphis without possessing a Memphis and Shelby County business license, excepting non-profit organizations that qualify as tax exempt under Sec. 501(c)(3) of the Internal Revenue Code.',
      sourceSection: 'Section 6'
    }
  ]);

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const toggleSubtask = (taskId, subtaskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const updatedSubtasks = task.subtasks.map(sub =>
          sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
        );
        const allComplete = updatedSubtasks.every(sub => sub.completed);
        return { ...task, subtasks: updatedSubtasks, completed: allComplete };
      }
      return task;
    }));
  };

  const toggleExpanded = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, expanded: !task.expanded } : task
    ));
  };

  const toggleDocument = (docId) => {
    setDocuments(documents.map(doc =>
      doc.id === docId ? { ...doc, uploaded: !doc.uploaded } : doc
    ));
  };

  const getDaysUntil = (dateStr) => {
    const today = new Date('2025-11-08');
    const target = new Date(dateStr);
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

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
              <h3 className="text-lg font-bold text-slate-900">{item.name || item.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{item.sourceSection}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
          <div className="p-5 overflow-y-auto max-h-[60vh]">
            {type === 'document' && item.instructions && (
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
              <p className="text-sm text-slate-600 leading-relaxed italic">"{item.sourceText}"</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {selectedInfo && (
        <InfoModal 
          item={selectedInfo.item} 
          type={selectedInfo.type}
          onClose={() => setSelectedInfo(null)} 
        />
      )}
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">RFQ #324765</h1>
              <p className="text-slate-600">Ground Maintenance Services - Central Zone 2</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-red-600">11 DAYS</div>
              <div className="text-sm text-slate-600">Until Submission</div>
              <div className="text-xs text-slate-500 mt-1">Due: Nov 19, 2025 @ 12:00 PM CT</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-5 border border-slate-200">
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

          <div className="bg-white rounded-lg shadow-sm p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-700">Documents Ready</h3>
              <FileText className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">{uploadedDocs}/{totalDocs}</div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${(uploadedDocs / totalDocs) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-700">Contract Value</h3>
              <DollarSign className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">TBD</div>
            <div className="text-xs text-slate-500">2 years + 2 optional years</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-700">Total Acreage</h3>
              <MapPin className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">19</div>
            <div className="text-xs text-slate-500">Across 6 park locations</div>
          </div>
        </div>

        {/* Qualifications Section */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg shadow-sm mb-6">
          <div className="p-5">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-amber-700" />
              </div>
              <div className="flex-grow">
                <h2 className="text-lg font-bold text-amber-900 mb-3">Required Qualifications & Equipment</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Business Qualifications */}
                  <div>
                    <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Business Requirements
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-1.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-amber-900">Minimum 2 Years Experience</span>
                          <p className="text-amber-700 text-xs">In grounds maintenance or equivalent</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-1.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-amber-900">Business License</span>
                          <p className="text-amber-700 text-xs">Memphis & Shelby County (if located in Memphis)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-1.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-amber-900">3 Verifiable References</span>
                          <p className="text-amber-700 text-xs">From similar-scale operations on letterhead</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-1.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-amber-900">Drug-Free Workplace Policy</span>
                          <p className="text-amber-700 text-xs">Must comply with City requirements</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Insurance Requirements */}
                  <div>
                    <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Insurance Coverage
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-1.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-amber-900">Workers' Compensation</span>
                          <p className="text-amber-700 text-xs">Tennessee statutory requirements OR &lt;5 employee letter</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-1.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-amber-900">Auto Liability: $1,000,000</span>
                          <p className="text-amber-700 text-xs">Combined single limit (owned/non-owned/hired)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-1.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-amber-900">General Liability: $1,000,000</span>
                          <p className="text-amber-700 text-xs">Per occurrence, City named as additional insured</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-1.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-amber-900">Umbrella/Excess: $1,000,000</span>
                          <p className="text-amber-700 text-xs">Each occurrence and aggregate</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-1.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-amber-900">Property Insurance</span>
                          <p className="text-amber-700 text-xs">On all contractor-owned equipment</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Equipment Requirements */}
                  <div>
                    <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Required Equipment
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-1.5 flex-shrink-0" />
                        <span className="text-amber-900">Commercial-grade tractors</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-1.5 flex-shrink-0" />
                        <span className="text-amber-900">Zero-turn mowers</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-1.5 flex-shrink-0" />
                        <span className="text-amber-900">Mulching mowers</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-1.5 flex-shrink-0" />
                        <span className="text-amber-900">Commercial blowers</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-1.5 flex-shrink-0" />
                        <span className="text-amber-900">Weed eaters/trimmers</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-1.5 flex-shrink-0" />
                        <span className="text-amber-900">Walk-behind bush cutters</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-1.5 flex-shrink-0" />
                        <span className="text-amber-900">Hand tools (rakes, shovels)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-1.5 flex-shrink-0" />
                        <span className="text-amber-900">Trash bags & supplies</span>
                      </div>
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
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <span className="text-red-900">Missing site visit form</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <span className="text-red-900">Late submission (after 12:00 PM CT)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <span className="text-red-900">Unsigned required documents</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <span className="text-red-900">Equipment not available for inspection</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <span className="text-red-900">Missing any required exhibits</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <span className="text-red-900">Undisclosed criminal/civil proceedings</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task List - Takes 2 columns */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="p-5 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Tasks & Deadlines
              </h2>
            </div>
            <div className="p-5 space-y-3 max-h-[600px] overflow-y-auto">
              {tasks.map(task => {
                const daysUntil = getDaysUntil(task.dueDate);
                const isOverdue = daysUntil < 0;
                const isUrgent = daysUntil <= 3 && daysUntil >= 0;
                
                return (
                  <div key={task.id} className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className={`p-4 ${task.completed ? 'bg-green-50' : 'bg-white'}`}>
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleTask(task.id)}
                          className="mt-1 flex-shrink-0"
                        >
                          {task.completed ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-400" />
                          )}
                        </button>
                        <div className="flex-grow">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-grow">
                              <div className="flex items-center gap-2">
                                <h3 className={`font-semibold ${task.completed ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                                  {task.title}
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
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  isOverdue ? 'bg-red-100 text-red-700' :
                                  isUrgent ? 'bg-orange-100 text-orange-700' :
                                  'bg-blue-100 text-blue-700'
                                }`}>
                                  {isOverdue ? `${Math.abs(daysUntil)} days overdue` :
                                   daysUntil === 0 ? 'Due today' :
                                   `${daysUntil} days left`}
                                </span>
                                <span className="text-xs text-slate-500">{task.dueDate}</span>
                                {task.priority === 'high' && (
                                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                                    HIGH PRIORITY
                                  </span>
                                )}
                              </div>
                            </div>
                            {task.subtasks.length > 0 && (
                              <button
                                onClick={() => toggleExpanded(task.id)}
                                className="flex-shrink-0 p-1 hover:bg-slate-100 rounded"
                              >
                                {task.expanded ? (
                                  <ChevronUp className="w-5 h-5 text-slate-600" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-slate-600" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {task.subtasks.length > 0 && task.expanded && (
                      <div className="bg-slate-50 border-t border-slate-200 px-4 py-3">
                        <div className="space-y-2">
                          {task.subtasks.map(subtask => (
                            <div key={subtask.id} className="flex items-center gap-3">
                              <button
                                onClick={() => toggleSubtask(task.id, subtask.id)}
                                className="flex-shrink-0"
                              >
                                {subtask.completed ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Circle className="w-4 h-4 text-slate-400" />
                                )}
                              </button>
                              <span className={`text-sm ${subtask.completed ? 'text-slate-500 line-through' : 'text-slate-700'}`}>
                                {subtask.title}
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

          {/* Right Column - Summary & Documents */}
          <div className="space-y-6">
            {/* Project Summary */}
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
                  <div className="text-slate-600">Maintain 6 parks (19 total acres) including mowing, trimming, mulching, and hardscape maintenance</div>
                </div>
                <div>
                  <div className="font-semibold text-slate-700 mb-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Locations
                  </div>
                  <div className="text-slate-600 space-y-1">
                    <div>• Gaisman (3 ac)</div>
                    <div>• Lester (4 ac)</div>
                    <div>• Skinner (3 ac)</div>
                    <div>• Glenview (5 ac)</div>
                    <div>• Orange Mound (1 ac)</div>
                    <div>• Davis (3 ac)</div>
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-slate-700 mb-1">Duration</div>
                  <div className="text-slate-600">2 years + optional 2 one-year renewals</div>
                </div>
                <div>
                  <div className="font-semibold text-slate-700 mb-1">Key Requirements</div>
                  <div className="text-slate-600 space-y-1">
                    <div>✓ Mandatory site visits</div>
                    <div>✓ Commercial-grade equipment</div>
                    <div>✓ Equipment inspection after selection</div>
                    <div>✓ Minimum 2 years experience</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Checklist */}
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
                    key={doc.id}
                    className={`border rounded-lg overflow-hidden ${
                      doc.uploaded ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3 flex-grow">
                        <button
                          onClick={() => toggleDocument(doc.id)}
                        >
                          {doc.uploaded ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-400" />
                          )}
                        </button>
                        <div className="flex-grow">
                          <div className="flex items-center gap-2">
                            <div className={`text-sm font-medium ${doc.uploaded ? 'text-slate-600' : 'text-slate-900'}`}>
                              {doc.name}
                            </div>
                            <button
                              onClick={() => setSelectedInfo({ item: doc, type: 'document' })}
                              className="p-1 hover:bg-slate-200 rounded transition-colors"
                              title="View instructions and source"
                            >
                              <Info className="w-4 h-4 text-blue-600" />
                            </button>
                          </div>
                          {doc.required && !doc.uploaded && (
                            <div className="text-xs text-red-600 mt-0.5">Required</div>
                          )}
                          {doc.instructions && (
                            <div className="text-xs text-slate-500 mt-1 line-clamp-1">
                              {doc.instructions}
                            </div>
                          )}
                        </div>
                      </div>
                      {!doc.uploaded && (
                        <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors flex-shrink-0">
                          <Upload className="w-4 h-4 text-slate-600" />
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
    </div>
  );
};

export default RFPDashboard;