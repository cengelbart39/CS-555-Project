import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve nutrientTracker.html at the root route
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'nutrientTracker.html'));
});

export default router;