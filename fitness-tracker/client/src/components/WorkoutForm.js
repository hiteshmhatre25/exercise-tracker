import React, { useState } from 'react';
import axios from 'axios';

const WorkoutForm = () => {
  const [formData, setFormData] = useState({
    type: '',
    duration: '',
    date: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('/api/workouts', {
        ...formData,
        duration: Number(formData.duration)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ type: '', duration: '', date: '' });
      setError('');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add workout');
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Workout</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="type"
          placeholder="Workout Type"
          value={formData.type}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="duration"
          placeholder="Duration (minutes)"
          value={formData.duration}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Workout</button>
      </form>
    </div>
  );
};

export default WorkoutForm;
