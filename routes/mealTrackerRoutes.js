import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { ObjectId }   from 'mongodb';
import { meals }      from '../config/mongoCollections.js';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/mealTracker', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'mealTracker.html'));
});

router.get('/api/meals', async (req, res) => {
  try {
    const col   = await meals();
    const items = await col.find({}).toArray();
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/api/meals', async (req, res) => {
  try {
    const {
      mealName,
      calories,
      protein,
      carbs,
      fats,
      mealDate,
      category
    } = req.body;

    if (!mealName || !calories || !category) {
      return res.status(400).json({ error: 'Name, calories and category are required' });
    }
    const validCats = ['Breakfast','Lunch','Dinner','Snacks'];
    if (!validCats.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const newMeal = {
      _id:       new ObjectId(),
      name:      mealName,
      calories:  Number(calories),
      protein:   Number(protein) || 0,
      carbs:     Number(carbs)   || 0,
      fats:      Number(fats)    || 0,
      date:      mealDate,
      category,
      createdAt: new Date()
    };

    const col          = await meals();
    const insertResult = await col.insertOne(newMeal);
    if (!insertResult.acknowledged) {
      throw new Error('Failed to insert meal');
    }
    res.status(201).json(newMeal);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});


export default router;