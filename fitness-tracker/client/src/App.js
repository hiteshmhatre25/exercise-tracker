import React, { useState, useEffect } from 'react';
import WorkoutForm from './components/WorkoutForm';
import WorkoutList from './components/WorkoutList';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return (
      <>
        {showRegister ? (
          <>
            <RegisterForm onRegister={() => setShowRegister(false)} />
            <p>Already have an account? <button onClick={() => setShowRegister(false)}>Login</button></p>
          </>
        ) : (
          <>
            <LoginForm onLogin={() => setLoggedIn(true)} />
            <p>Don't have an account? <button onClick={() => setShowRegister(true)}>Register</button></p>
          </>
        )}
      </>
    );
  }

  return (
    <div className="app">
      <h1>Fitness Tracker</h1>
      <button onClick={handleLogout}>Logout</button>
      <WorkoutForm />
      <WorkoutList />
    </div>
  );
}

export default App;
