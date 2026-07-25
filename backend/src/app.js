import express from 'express';
import cors from 'cors';
import aiRoutes from './routes/aiRoutes.js';
import ocrRoutes from './routes/ocrRoutes.js';
import schemeRoutes from './routes/schemeRoutes.js';
import userRoutes from './routes/userRoutes.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

// Enable Cross-Origin Resource Sharing for front-end interface
app.use(cors({
  origin: '*', // Customize to specific domain in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// API route mappings
app.use('/api/chat', aiRoutes);
app.use('/api/ocr', ocrRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/users', userRoutes);

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Global error handler
app.use(errorHandler);

export default app;
