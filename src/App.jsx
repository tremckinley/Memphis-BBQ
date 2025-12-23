import { useState } from 'react'
import RFPDashboard from './RFPDashboard'
import RFPUploader from './components/RFPUploader'
import sampleRfpData from '../rfp_data'
import './App.css'


function App() {
  const [rfpData, setRfpData] = useState(null);
  const [showDemo, setShowDemo] = useState(false);

  // Handler when AI analysis completes
  const handleAnalysisComplete = (data) => {
    setRfpData(data);
  };

  // Handler to go back to upload screen
  const handleNewAnalysis = () => {
    setRfpData(null);
    setShowDemo(false);
  };

  // Handler to load demo data
  const handleLoadDemo = () => {
    setRfpData(sampleRfpData);
    setShowDemo(true);
  };

  // If we have RFP data (from AI or demo), show the dashboard
  if (rfpData) {
    return (
      <RFPDashboard
        rfpData={rfpData}
        onNewAnalysis={handleNewAnalysis}
        isDemo={showDemo}
      />
    );
  }

  // Otherwise show the uploader
  return (
    <div>
      <RFPUploader onAnalysisComplete={handleAnalysisComplete} />

      {/* Demo button */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={handleLoadDemo}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors shadow-lg"
        >
          Try Demo Data
        </button>
      </div>
    </div>
  );
}

export default App
