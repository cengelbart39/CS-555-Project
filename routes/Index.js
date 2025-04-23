// routes/index.js
import authRoutes from './authRoutes.js';
import nutritionRoutes from './nutritionTrackerRoutes.js';
import mealTrackerRoutes from './mealTrackerRoutes.js'

const constructorMethod = (app) => {
  // Auth routes (login, signup, etc.)
  app.use('/', authRoutes);
  
  // API routes for nutrition data
  app.use('/api/nutrition', nutritionRoutes);

  app.use('/', mealTrackerRoutes);
  
  // 404 route
  app.use('*', (req, res) => {
    res.status(404).send('Not found');
  });
};

export default constructorMethod;