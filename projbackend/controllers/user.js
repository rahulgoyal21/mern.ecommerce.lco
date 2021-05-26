const { TokenExpiredError } = require('jsonwebtoken');
const User = require('../models/user');
const Order = require('../models/order');
/**
 * PARAMETER EXTRACTOR (userId)
 * @method getUserById
 * @summary Middleware Helper methods to set the User to req.profile
 */
exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user)
      return res.status(400).json({ error: 'No user found in DB' });
    req.profile = user; //Creating a profile key in req object explicitely
    next();
  });
};

/**
 * @method getUser
 * @summary GET the user by id
 * @access Private
 * @route GET /api/user/:userId
 */
exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  return res.json(req.profile);
};

/**
 * @method updateUser
 * @summary UPDATE the user by id
 * @access Private
 * @route PUT /api/user/:userId
 */
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      {
        _id: req.profile._id
      },
      { $set: req.body },
      { new: true, useFindAndModify: false }
    );
    if (user) {
      user.salt = undefined;
      user.encry_password = undefined;
      res.json(user);
    } else return res.status(400).json({ error: "User can't be modified" });
  } catch (err) {
    console.log(err);
    return res.status(500).send('Internal server error');
  }
};

/**
 * @method userPurchaseList
 * @summary GET the user purchase list by userId
 * @access Private
 * @route GET /api/orders/user/:userId
 */
exports.userPurchaseList = async (req, res) => {
  try {
    const order = await Order.find({ user: req.profile._id }).populate(
      'user',
      '_id name'
    );
    if (order) return res.json(order);
    else return res.status(400).json({ error: 'No order found for this user' });
  } catch (err) {
    console.log(err);
    return res.status(500).send('Internal server error');
  }
};

/**
 * @method pushOrderInPurchaseList
 * @summary Middleware Helper methods to push the ordered items in purchases array
 */

exports.pushOrderInPurchaseList = async (req, res, next) => {
  // req.body.order.products from frontend
  let purchases = [];
  req.body.order.products.forEach(product => {
    purchases.push({
      _id: product._id,
      name: product,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id
    });
  });

  //'new' flag tells to send the update object, not the old one
  try {
    const userPurchases = await User.findOneAndUpdate(
      { _id: req.profile._id },
      { $push: { purchases: purchases } },
      { new: true }
    );
    if (!userPurchases)
      return res
        .status(400)
        .json({ error: "User purchase list can't be saved" });
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).send('Internal server error');
  }
};
