import tempRoutes from './nutritionTrackerRoutes.js';

const constructorMethod = (app) => {
  app.use('/', nutritionTrackerRoutes);

  app.use('*', (req, res) => {
    res.status(404).send('Page not found');
  });
};

export default constructorMethod;
