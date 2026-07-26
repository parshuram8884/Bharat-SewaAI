import express from 'express';
import cors from 'cors';
import aiRoutes from './routes/aiRoutes.js';
import ocrRoutes from './routes/ocrRoutes.js';
import schemeRoutes from './routes/schemeRoutes.js';
import userRoutes from './routes/userRoutes.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

// Enable Cross-Origin Resource Sharing for front-end interface
const allowedOrigins = [
  'https://bharat-sewaai.onrender.com',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5000'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl) or matching allowedOrigins / wildcard
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.onrender.com')) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive fallback to prevent CORS blocks in production
    }
  },
  credentials: true,
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
