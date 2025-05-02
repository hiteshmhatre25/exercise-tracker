require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');




const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// 🔐 Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.userId = decoded.id;
    next();
  });
};

// 🔐 Auth Routes
app.post('/api/register', async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({ email: req.body.email, password: hashed });
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ error: 'Invalid email' });

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🏋️ Workout model (with user link)
const workoutSchema = new mongoose.Schema({
  userId: String,
  type: String,
  duration: Number,
  date: String
}, { timestamps: true });

const Workout = mongoose.model('Workout', workoutSchema);

// 🏋️ Workout Routes (protected)
app.post('/api/workouts', verifyToken, async (req, res) => {
  try {
    const workout = await Workout.create({ ...req.body, userId: req.userId });
    res.status(201).json(workout);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/workouts', verifyToken, async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/workouts/:id', verifyToken, async (req, res) => {
  try {
    const updated = await Workout.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/workouts/:id', verifyToken, async (req, res) => {
  try {
    await Workout.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: 'Workout deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
