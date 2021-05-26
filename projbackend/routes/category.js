const express = require('express');
const router = express.Router();
const {
  getCategoryById,
  createCategory,
  getCategory,
  getAllCategories,
  updateCategory,
  removeCategory
} = require('../controllers/category');
const { getUserById } = require('../controllers/user');
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');

//Parameter extractor to see the Param 'categoryId', 'userId'
router.param('userId', getUserById);
router.param('categoryId', getCategoryById);

//Create
router.post(
  '/category/create/:userId',
  isSignedIn,
  isAdmin,
  isAuthenticated,
  createCategory
);

//Read
router.get('/category/:categoryId', getCategory);
router.get('/categories', getAllCategories);

//Update
router.put(
  '/category/:categoryId/:userId',
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateCategory
);

//Delete
router.delete(
  '/category/:categoryId/:userId',
  isSignedIn,
  isAuthenticated,
  isAdmin,
  removeCategory
);

module.exports = router;
