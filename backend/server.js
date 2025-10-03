require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const leadRoutes = require('./routes/leads');
const teamRoutes = require('./routes/teams');
const analyticsRoutes = require('./routes/analytics');
const activitiesRoutes = require('./routes/activities');
connectDB();
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: [
    process.env.FRONTEND_ORIGIN,
    "http://localhost:3000"
  ],
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/activities', activitiesRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status||500).json({message: err.message||'Server error'});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log('Server running on', PORT));
