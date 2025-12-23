import { useState } from 'react'
import RFPDashboard from './RFPDashboard'
import DocSubmissionForm from './assets/DocSubmissionForm'
import './App.css'


function App() {
  const [rfpData, setRfpData] = useState(null);

  return (
    <>
      {!rfpData ? (
        <DocSubmissionForm onAnalysisComplete={setRfpData} />
      ) : (
        <RFPDashboard rfpData={rfpData} />
      )}
    </>
  )
}

export default App
