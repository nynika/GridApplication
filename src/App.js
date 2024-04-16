import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import OverallView from './components/overallView/OverallView';
import Radiology from './components/Radiology/Radiology';
import Lab from './components/Lab/Lab';
import Admission from './components/Admission/Admission';
import Pharmacy from './components/Pharmacy/Pharmacy';
import Login from './components/Login/Login'; 
import Dashboard from './components/Dashboard/Dashboard'; 
import './App.css';

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLogin = (role) => {
    console.log(role)
    setLoggedInUser(role);
  };

  return (
    <Router>
      <div className="App">
        <h1 align="center">Patient Tracking</h1>
        <nav>
        {/*   <ul>
      
            {loggedInUser && ( 
              <>
               <li><Link to="/overallView">OverallView</Link></li>
                <li><Link to="/radiology">Radiology</Link></li>
                <li><Link to="/lab">Lab</Link></li>
                <li><Link to="/admission">Admission</Link></li>
                <li><Link to="/pharmacy">Pharmacy</Link></li>
              </>
            )}
          </ul> */}
        </nav>
        <div className="content">
          <Routes>
            <Route exact path="/login" element={<Login onLogin={handleLogin} />} />
            <Route exact path="/Dashboard" element={<Dashboard />} />
            {loggedInUser === "overallView" && <Route exact path="/overallView" element={<OverallView />} />}

            {loggedInUser === "radiology" && <Route exact path="/radiology" element={<Radiology />} />}
            {loggedInUser === "lab" && <Route exact path="/lab" element={<Lab />} />} 
            {loggedInUser === "admission" && <Route exact path="/admission" element={<Admission />} />}
            {loggedInUser === "pharmacy" && <Route exact path="/pharmacy" element={<Pharmacy />} />}
      
            {!loggedInUser && <Route path="*" element={<Navigate to="/login" />} />}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
