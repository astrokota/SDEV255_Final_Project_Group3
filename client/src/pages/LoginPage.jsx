import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState(null); // 'student' or 'teacher'
  const [error, setError] = useState('');
  
  const { login } = useContext(AuthContext);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        
        const userToken = data.token;
        const userRole = data.user.role;

        
        if (userRole.toLowerCase() !== selectedRole.toLowerCase()) {
          setError(`This account is registered as a ${userRole}, not a ${selectedRole}.`);
          return;
        }

        
        login(userToken, userRole);
      } else {
        setError(data.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Server error. Please try again later.');
    }
  };

  // STAGE 1: Role Selection
  if (!selectedRole) {
    return (
      <div className="login-container">
        <h2>Welcome to Course Registration</h2>
        <p>Please select your role to continue:</p>
        <div className="role-buttons">
          <button className="role-btn" onClick={() => setSelectedRole('student')}>
            I am a Student
          </button>
          <button className="role-btn" onClick={() => setSelectedRole('teacher')}>
            I am a Teacher
          </button>
        </div>
      </div>
    );
  }

  // STAGE 2: Email/Password Form
  return (
    <div className="login-container">
      <h2>{selectedRole === 'teacher' ? 'Teacher Login' : 'Student Login'}</h2>
      
      {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleLogin} className="login-form">
        <div className="input-group">
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="example@college.edu" 
            required 
          />
        </div>
        
        <div className="input-group">
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter password" 
            required 
          />
        </div>

        <button type="submit" className="login-submit-btn">Sign In</button>
        
        <button 
          type="button" 
          className="back-btn" 
          onClick={() => {
            setSelectedRole(null);
            setError('');
          }}
          style={{ marginTop: '10px', background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}
        >
          ← Back to role selection
        </button>
      </form>
    </div>
  );
};

export default LoginPage;