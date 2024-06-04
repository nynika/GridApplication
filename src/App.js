import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes,  Navigate } from 'react-router-dom';
import OverallView from './components/overallView/OverallView';
import Radiology from './components/Radiology/Radiology';
import Lab from './components/Lab/Lab';
import Admission from './components/Admission/Admission';
import Pharmacy from './components/Pharmacy/Pharmacy';
import Login from './components/Login/Login'; 
//import Dashboard from './components/Dashboard/Dashboard'; 
import './App.css';
 


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
      </div>
     
        <div className="content">
          <Routes>
            <Route exact path="/login" element={<Login onLogin={handleLogin} />} />
          {/*   <Route exact path="/Dashboard" element={<Dashboard />} /> */}

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


