import { Router } from 'express';
import articleRoutes from './articles';
import userRoutes from './users';
import interactionRoutes from './interactions';
import recommendationRoutes from './recommendations';

const router = Router();

// Mount route modules
router.use('/articles', articleRoutes);
router.use('/users', userRoutes);
router.use('/interactions', interactionRoutes);
router.use('/recommendations', recommendationRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;