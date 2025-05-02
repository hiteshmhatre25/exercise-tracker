import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ type: '', duration: '', date: '' });
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get('/api/workouts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWorkouts(response.data);
    } catch (err) {
      setError('Failed to fetch workouts');
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/workouts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchWorkouts();
    } catch {
      setError('Failed to delete workout');
    }
  };

  const handleEditClick = (workout) => {
    setEditingId(workout._id);
    setEditData({
      type: workout.type,
      duration: workout.duration,
      date: workout.date.slice(0, 10)
    });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`/api/workouts/${id}`, {
        ...editData,
        duration: Number(editData.duration)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingId(null);
      fetchWorkouts();
    } catch {
      setError('Failed to update workout');
    }
  };

  return (
    <div className="workout-list">
      <h2>Your Workouts</h2>
      {error && <p className="error">{error}</p>}
      <ul>
        {workouts.map((workout) => (
          <li key={workout._id}>
            {editingId === workout._id ? (
              <>
                <input
                  type="text"
                  name="type"
                  value={editData.type}
                  onChange={handleEditChange}
                />
                <input
                  type="number"
                  name="duration"
                  value={editData.duration}
                  onChange={handleEditChange}
                />
                <input
                  type="date"
                  name="date"
                  value={editData.date}
                  onChange={handleEditChange}
                />
                <button onClick={() => handleUpdate(workout._id)}>Update</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <strong>{workout.type}</strong> - {workout.duration} mins on {new Date(workout.date).toLocaleDateString()}
                <br />
                <button onClick={() => handleEditClick(workout)}>Edit</button>
                <button onClick={() => handleDelete(workout._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkoutList;
