const User = require('../models/user');
const { validationResult } = require('express-validator');
exports.signout = (req, res) => {
  res.json({
    message: 'This is signout route'
  });
};

exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res
      .status(422)
      .json({ error: errors.array().map(item => item.msg) });
  const userExist = await User.findOne({ email: req.body.email });
  if (userExist) return res.status(400).json({ error: 'User already exist' });
  else {
    const user = new User(req.body);
    user.save((err, user) => {
      if (err)
        return res
          .status(400)
          .json({ error: 'Not able to save user in DB', err });
      res.json({
        name: user.name,
        email: user.email,
        id: user._id
      });
    });
  }
};
