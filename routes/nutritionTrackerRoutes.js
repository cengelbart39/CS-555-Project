// routes/nutritionRoutes.js
import { Router } from 'express';
import { 
  getUserNutritionData,
  addNutritionRecord,
  updateNutritionRecord,
  deleteNutritionRecord,
  getUserMacroGoals,
  setUserMacroGoals,
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
    const { period = 'daily' } = req.query;
    const nutritionData = await getUserNutritionData(userId, period);
    res.json(nutritionData);
  } catch (e) {
    res.status(500).json({ error: e.message || 'Failed to get nutrition data' });
  }
});

// Add a new nutrition record
router.post('/', async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { period } = req.query; //Daily, weekly, monthly
    const { protein, carbs, fat } = req.body;
    const newRecord = await addNutritionRecord(userId, protein, carbs, fat, period);
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
    const { period = 'daily' } = req.query;
    const result = await updateNutritionRecord(userId, recordId, period, req.body);
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
    const { period = 'daily' } = req.query;
    const result = await deleteNutritionRecord(userId, recordId, period);
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message || 'Failed to delete nutrition record' });
  }
});

// returns { protein, carbs, fat } for current user
router.get('/goals', async (req, res) => {
  try {
    const userId = req.session.user._id;
    const goals  = await getUserMacroGoals(userId);
    res.json(goals);
  } catch (e) {
    res.status(500).json({ error: e.message || 'Failed to load macro goals' });
  }
});

// saves/updates macro goals
router.put('/goals', async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { protein, carbs, fat } = req.body;
    const updated = await setUserMacroGoals(userId, protein, carbs, fat);
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message || 'Failed to save macro goals' });
  }
});


export default router;