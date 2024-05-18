import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes,  Navigate } from 'react-router-dom';
import OverallView from './components/overallView/OverallView';
import Radiology from './components/Radiology/Radiology';
import Lab from './components/Lab/Lab';
import Admission from './components/Admission/Admission';
import Pharmacy from './components/Pharmacy/Pharmacy';
import Login from './components/Login/Login'; 
import Dashboard from './components/Dashboard/Dashboard'; 
import './App.css';
/* import relalogo from './assets/relalogo.jpg';   */


function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
      const userDetails = localStorage.getItem('user');
      if (userDetails) {
          setLoggedInUser(JSON.parse(userDetails));
      }
  }, []);

  const handleLogin = (userDetails) => {
      setLoggedInUser(userDetails);
      localStorage.setItem('user', JSON.stringify(userDetails));
  };

   
  return (
    <Router>
    <div className="App">
      <div style={{ backgroundColor: 'rgba(5, 10, 50, 0.1)' }}>

        {/* <img src={relalogo} alt="OPD Patient Tracking" style={{ width: '150px',position:'absolute',left:'50px' ,top:'0px'}} /> */}
     {/*   <h1 style={{ textAlign: 'center' }}>OPD Patient Tracking</h1> */}
      </div>


{/* <div style={{ backgroundColor: 'rgba(5, 10, 50, 0.1)' }}>
    <div style={{ textAlign: 'center', padding: '2px 0' }}>
        <img src={relalogo} alt="OPD Patient Tracking" style={{ width: '150px', position: 'absolute', marginLeft: '-750px' }} />
        <h1 style={{ textAlign: 'center' }}>OPD Patient Tracking</h1>
    </div>

</div> */}


     
        <div className="content">
          <Routes>
            <Route exact path="/login" element={<Login onLogin={handleLogin} />} />
            <Route exact path="/Dashboard" element={<Dashboard />} />

   
            <Route path="/lab" element={<Lab user={loggedInUser} />} />
            <Route path="/radiology" element={<Radiology user={loggedInUser} />} />
            <Route path="/admission" element={<Admission user={loggedInUser} />} />
            <Route path="/pharmacy" element={<Pharmacy user={loggedInUser} />} />

            <Route path="/overallView" element={<OverallView user={loggedInUser} />} />
         
          <Route path="*" element={!loggedInUser ? <Navigate to="/login" /> : <Navigate to={`/${loggedInUser.role}`} />} />
        </Routes>
    
        </div>
      </div>
    </Router>
  );
}

export default App;




/* 


import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import OverallView from './components/overallView/OverallView';
import Radiology from './components/Radiology/Radiology';
import Lab from './components/Lab/Lab';
import Admission from './components/Admission/Admission';
import Pharmacy from './components/Pharmacy/Pharmacy';
import Login from './components/Login/Login'; 
import Dashboard from './components/Dashboard/Dashboard'; 
import './App.css';  // Ensure this contains the correct styles
import relalogo from './assets/relalogo.jpg';  

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLogin = (userDetails) => {
    setLoggedInUser(userDetails);
  };

  return (
    <Router>
      <div className="App">
        <header>
          <img src={relalogo} alt="OPD Patient Tracking" style={{ width: '150px', position: 'absolute', left: '50px', top: '0px' }} />
          <h1>OPD Patient Tracking</h1>
          {loggedInUser && (
            <div style={{ position: 'absolute', right: '20px', top: '10px' }}>
              <p>{loggedInUser.username} ({loggedInUser.role})</p>
            </div>
          )}
        </header>
        
        <div className="content">
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/radiology" element={<Radiology />} />
            <Route path="/lab" element={<Lab />} />
            <Route path="/admission" element={<Admission />} />
            <Route path="/pharmacy" element={<Pharmacy />} />
            <Route path="/overallView" element={<OverallView user={loggedInUser} />} />
            <Route path="*" element={!loggedInUser ? <Navigate to="/login" /> : <Navigate to={`/${loggedInUser.role}`} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App; */
