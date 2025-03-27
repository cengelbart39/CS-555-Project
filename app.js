import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import configRoutes from './routes/index.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

configRoutes(app);

app.use(express.static(__dirname));


app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
