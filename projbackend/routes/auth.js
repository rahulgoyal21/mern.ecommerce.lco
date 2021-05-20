const express = require('express');
const router = express.Router();
const { signout, signup } = require('../controllers/auth');
const { check } = require('express-validator');

router.post(
  '/signup',
  [
    check('name')
      .isLength({ min: 5 })
      .withMessage('Name should have minimum 5 characters'),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password should be at least 3 char').isLength({ min: 3 })
  ],
  signup
);
router.get('/signout', signout);

module.exports = router;
