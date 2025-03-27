import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import open from 'open'

import configRoutes from './routes/index.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'simple-nutrition-secret',
    resave: false,
    saveUninitialized: false
  })
);

configRoutes(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  try{
    console.log("We've now got a server!");
    console.log(`server is running at http://localhost:${PORT}`); 
    console.log('opening browser');
    await open(`http://localhost:${PORT}`);
    console.log('browser opened successfully')
  } catch (e) {
    console.error('failed to open browser:', e)
  }
});