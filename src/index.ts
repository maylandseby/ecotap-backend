import express from 'express';
import cors from 'cors';
import { PORT } from './config/config.js';
import billRoutes from './routes/billRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Route
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/bills', billRoutes);

// Global Error Handler Middleware (Must be registered last)
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Eco Tap backend running on http://localhost:${PORT}`);
});