const User = require('../models/user');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

/**
 * @method signup
 * @route POST /api/signup
 * @summary To signup the user
 * @access Public
 */
exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });
  try {
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist)
      return res.status(400).json({ errors: [{ msg: 'User already exist' }] });
    else {
      //Saving the user into the database
      const user = new User(req.body);
      user.save((err, user) => {
        if (err)
          return res
            .status(400)
            .json({ errors: [{ msg: 'Not able to save the user in DB' }] });
        res.json({
          name: user.name,
          email: user.email,
          id: user._id
        });
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server error');
  }
};

/**
 * @method signin
 * @route POST /api/signin
 * @summary To signin the user and get json web token
 * @access Public
 */
exports.signin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    //See if user exists
    if (!user)
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });

    //Password matching
    if (!user.authenticate(password))
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });

    //Create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);

    //put token in cookie
    res.cookie('token', token, { expire: new Date() + 9999 });

    const { _id, name, role } = user;
    return res.json({ token, user: { _id, name, email: user.email, role } });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal server error');
  }
};

/**
 * @method signout
 * @route GET /api/signout
 * @summary To signout the user and clear token from cookies
 * @access Public
 */
exports.signout = (req, res) => {
  res.clearCookie('token');
  res.json({
    message: 'User logged out successfully'
  });
};

//Protected routes, here expressJwt is providing next() method internally
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: 'auth'
});

//Custsom middlewares
exports.isAuthenticated = (req, res, next) => {
  //profile is going to be set from frontend
  //req.auth from isSignedIn middleware
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker)
    return res.status(403).json({
      error: 'ACCESS DENIED'
    });
  next();
};

exports.isAdmin = (req, res, next) => {
  //0 is for regular user
  if (req.profile.role === 0)
    return res.status(403).json({ error: 'You are not admin, Access denied' });
  next();
};
