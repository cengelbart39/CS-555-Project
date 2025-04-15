import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createUser, checkUser } from '../data/users.js';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root route - redirect based on authentication
router.get('/', (req, res) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname, '..', 'public', 'nutrientTracker.html'));
  } else {
    res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
  }
});

// Login routes
router.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await checkUser(username, password);
    
    // Set session
    req.session.user = {
      _id: user._id.toString(),
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName
    };
    
    res.redirect('/');
  } catch (e) {
    res.status(401).send(e.message || 'Login failed');
  }
});

// Make sure this route handler is in your authRoutes.js file
router.get('/signup', (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, '..', 'public', 'signup.html'));
});

// Signup routes
// In authRoutes.js - update the signup route handler
router.post('/signup', async (req, res) => {
  const { username, password, firstName, lastName } = req.body;
  
  try {
    await createUser(username, password, firstName, lastName);
    res.redirect('/login');
  } catch (e) {
    res.status(400).send(e.message || 'Signup failed');
  }
});

// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

export default router;