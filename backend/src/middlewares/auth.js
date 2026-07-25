import { createClerkClient } from '@clerk/backend';
import dotenv from 'dotenv';

dotenv.config();

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }

    const token = authHeader.split(' ')[1];
    
    // In production, we authenticate the token session
    // For scaffolding, we verify the claims or mock if it's a test token
    if (process.env.CLERK_SECRET_KEY === 'sk_test_placeholder') {
      req.auth = { userId: 'mock_clerk_user_id' };
      return next();
    }

    const verified = await clerkClient.verifyToken(token);
    req.auth = { userId: verified.sub, claims: verified };
    next();
  } catch (error) {
    console.error('Authentication Error:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export default requireAuth;
