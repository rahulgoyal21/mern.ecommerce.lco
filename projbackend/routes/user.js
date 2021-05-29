const express = require('express');
const router = express.Router();
const {
  getUserById,
  getUser,
  updateUser,
  userPurchaseList
} = require('../controllers/user');
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');

//Parameter extractor to see the Param 'userId'
router.param('userId', getUserById);

//Read
router.get('/user/:userId', isSignedIn, isAuthenticated, getUser);

//Update
router.put('/user/:userId', isSignedIn, isAuthenticated, updateUser);
router.put(
  'orders/user/:userId',
  isSignedIn,
  isAuthenticated,
  userPurchaseList
);

module.exports = router;
