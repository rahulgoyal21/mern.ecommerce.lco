const _ = require('lodash');
const { Order, ProductCart } = require('../models/order');

/**
 * PARAMETER EXTRACTOR (orderId)
 * @method getOrderById
 * @summary Middleware Helper methods to set the order to req.order
 */

exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate('products.product', 'name price') //"products.product" on which field to populate in Order, "name price" which fields to include from Product schema
    .exec((err, order) => {
      if (err || !order) return res.status(400).json({ error: `No order found with id ${id}` });
      req.order = order;
      next();
    });
};

/**
 * @method createOrder
 * @summary create the order with userId
 * @access Private
 * @route POST /api/order/create/:userId
 */
exports.createOrder = (req, res) => {
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save().exec((err, order) => {
    if (err) return res.status(400).json({ error: 'Failed to save the order in DB' });
  });
  return res.json(order);
};

/**
 * @method getAllOrders
 * @summary Gel all orders based on userId
 * @access Private
 * @route GET /api/order/create/:userId
 */
exports.getAllOrders = (req, res) => {
  Order.find()
    .populate('user', '_id name')
    .exec((err, orders) => {
      if (err) return res.status(400).json({ error: "Orders can't be fetched" });
      return res.json(orders);
    });
};

/**
 * @method getOrderStatus
 * @summary Get order status based on userId
 * @access Private
 * @route GET /api/order/status/:userId
 */

exports.getOrderStatus = (req, res) => {
  res.json(Order.schema.path('status').enumValues);
};

/**
 * @method updateStatus
 * @summary Update the status of order based on orderId and userId
 * @access Private
 * @route PUT /api/order/:orderId/status/:userId
 */

exports.updateStatus = (req, res) => {
  Order.updateOne(
    {
      _id: req.body.orderId
    },
    { $set: { status: req.body.status } }
  ).exec((err, order) => {
    if (err) return res.status(400).json({ error: `Order status with id ${req.body.orderId} couldn't be updated` });
    return res.json(order);
  });
};
