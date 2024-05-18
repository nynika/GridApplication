/* import React, { useState } from 'react';
import './login.css'; // Import the CSS file

const Login = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  
    let valid = false;
  
    if (username === '1' && password === '111') {
      handleLogin('OverallView');
      valid = true;
    } else if (username === '2' && password === '222') {
      handleLogin('Radiology');
      valid = true;
    } else if (username === '3' && password === '333') {
      handleLogin('Lab');
      valid = true;
    } else if (username === '4' && password === '444') {
      handleLogin('Admission');
      valid = true;
    } else if (username === '5' && password === '555') {
      handleLogin('Pharmacy');
      valid = true;
    }
  
    if (!valid) {
      alert('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-heading">Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="login-input" />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="login-input" />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default Login; 
 */


import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faKey } from '@fortawesome/free-solid-svg-icons';




const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://192.168.15.3/NewHIS/api/his/patLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ UserId: userId, Password: password }),
      });

      if (response.ok) {
        const data = await response.json();
        const userDetails = {
          userId: data.userId, 
          username: data.userName,
          role: data.userName.toLowerCase() 
        };
        onLogin(userDetails);  
        navigate(`/${userDetails.role}`);
      } else {
        alert('Failed to login. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      alert('An error occurred while logging in');
    }
  };

  
  return (

    <div className="login-container"  >
      <div className="login-content">
        <h2 className="login-heading">Patient Tracking Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
           <FontAwesomeIcon icon={faUser} className="input-icon" /> 
            <input
              placeholder='UserId'
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="login-input" 
              required
            />
          </div>
          <div className="input-group">
           <FontAwesomeIcon icon={faKey} className="input-icon" />
            <input
              placeholder='Password'
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
            />
          </div>
          <button type="submit" className="login-button">Sign In</button>
        </form>
      </div>
    </div>
  );
  
};

export default Login;







