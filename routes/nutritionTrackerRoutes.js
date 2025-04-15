// routes/nutritionRoutes.js
import { Router } from 'express';
import { 
  getUserNutritionData,
  addNutritionRecord,
  updateNutritionRecord,
  deleteNutritionRecord
} from '../data/nutrition.js';

const router = Router();

// Auth middleware for all nutrition routes
const ensureAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized - Please log in' });
  }
  next();
};

router.use(ensureAuthenticated);

// Get all nutrition records for the logged-in user
router.get('/', async (req, res) => {
  try {
    const userId = req.session.user._id;
    const nutritionData = await getUserNutritionData(userId);
    res.json(nutritionData);
  } catch (e) {
    res.status(500).json({ error: e.message || 'Failed to get nutrition data' });
  }
});

// Add a new nutrition record
router.post('/', async (req, res) => {
  try {
    const userId = req.session.user._id;
    const newRecord = await addNutritionRecord(userId, req.body);
    res.status(201).json(newRecord);
  } catch (e) {
    res.status(400).json({ error: e.message || 'Failed to add nutrition record' });
  }
});

// Update a nutrition record
router.put('/:id', async (req, res) => {
  try {
    const userId = req.session.user._id;
    const recordId = req.params.id;
    const result = await updateNutritionRecord(userId, recordId, req.body);
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message || 'Failed to update nutrition record' });
  }
});

// Delete a nutrition record
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.session.user._id;
    const recordId = req.params.id;
    const result = await deleteNutritionRecord(userId, recordId);
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message || 'Failed to delete nutrition record' });
  }
});

export default router;