const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { signup, login, getMe } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
require('../config/googleAuth'); // initialize strategy

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    // Generate JWT
    const token = jwt.sign({ id: req.user.id, email: req.user.email, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    // Redirect to frontend with token
    res.redirect(`http://localhost:5173/oauth2-redirect?token=${token}`);
  }
);

module.exports = router;
