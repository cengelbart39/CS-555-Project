import tempRoutes from './nutritionTrackerRoutes.js';

const constructorMethod = (app) => {
  app.use('/', tempRoutes);

  // Handle 404 for any undefined routes
  app.use('*', (req, res) => {
    res.status(404).send('Page not found');
  });
};

export default constructorMethod;
