const express = require('express');
const router = express.Router();
const { signout, signin, signup, isSignedIn } = require('../controllers/auth');
const { check } = require('express-validator');

//signout, signin, signup are controllers

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

router.post(
  '/signin',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').not().isEmpty()
  ],
  signin
);

router.get('/signout', signout);

router.get('/testroute', isSignedIn, (req, res) => {
  // res.send('A protected route');
  res.json(req.auth);
});

module.exports = router;
