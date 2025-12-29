const express = require('express')
const cors = require('cors')
const app = express();
const authMiddleware = require('./middleware/auth');
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));
app.use(express.json());

const teamRoutes = require('./routes/teamRoutes');
const playerRoutes = require('./routes/playerRoutes');
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');
const newsRoutes = require('./routes/newsRoutes');
app.use('/api', teamRoutes);
app.use('/api', playerRoutes);
app.use('/api', userRoutes);
app.use('/api', gameRoutes);
app.use('/api', newsRoutes);
module.exports = app;