// routes/index.js (I changed it to lowercase)
import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const users = [];

// Home route
router.get('/', (req, res) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname, '..', 'public', 'nutrientTracker.html'));
  } else {
    res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
  }
});

// Login routes
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  
  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }
  
  
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).send('Invalid username or password');
  }
  
  
  req.session.user = {
    username: user.username,
    name: user.name
  };
  
  res.redirect('/');
});


router.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'signup.html'));
});

router.post('/signup', (req, res) => {
  const { name, username, password } = req.body;
  

  if (!name || !username || !password) {
    return res.status(400).send('All fields are required');
  }
  
 
  if (users.some(u => u.username === username)) {
    return res.status(400).send('Username already exists');
  }
  
 
  users.push({
    name,
    username,
    password  
  });
  
  res.redirect('/login');
});

// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

const constructorMethod = (app) => {
  app.use('/', router);
  
  app.use('*', (req, res) => {
    res.status(404).send('Not found');
  });
};

export default constructorMethod;