// routes/calendarRoutes.js
import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/calendar', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'calendar.html'));
});


export default router;
