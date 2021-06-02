const express = require('express');
const router = express.Router();
const {
  getProductById,
  getProduct,
  createProduct,
  photo,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getAllUniqueCategories
} = require('../controllers/product');
const { getUserById } = require('../controllers/user');
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');

//Parameter extractor to see the Param 'productId','userId';
router.param('userId', getUserById);
router.param('productId', getProductById);

//Create
router.post(
  '/product/create/:userId',
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
);

//Read
router.get('/product/:productId', getProduct);
router.get('/product/photo/:productId', photo);
router.get('/products', getAllProducts);
router.get('/products/categories', getAllUniqueCategories);

//Update
router.put(
  '/product/:productId/:userId',
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct
);

//Delete
router.delete(
  '/product/:productId/:userID',
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteProduct
);

module.exports = router;
