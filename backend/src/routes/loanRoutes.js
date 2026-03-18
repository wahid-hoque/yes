import express from 'express';
import loanController from '../controllers/loanController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/status', protect, loanController.getStatus);
router.post('/apply', protect, loanController.apply);
router.post('/repay/:loanId', protect, loanController.repay);

export default router;
