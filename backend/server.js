const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const surveyRoutes = require('./routes/survey');
const surveyResponseRoutes = require('./routes/surveyResponse'); // ✅ NEW

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/surveys', surveyResponseRoutes); // ✅ Add this

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
