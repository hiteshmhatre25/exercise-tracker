import React, { useState } from 'react';
import axios from 'axios';

const RegisterForm = ({ onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/register', { email, password });
      setError('');
      setSuccess('Registration successful! Please log in.');
      setEmail('');
      setPassword('');
      if (onRegister) onRegister();
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterForm;
