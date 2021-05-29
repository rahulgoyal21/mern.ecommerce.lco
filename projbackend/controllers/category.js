const Catogory = require('../models/category');

/**
 * PARAMETER EXTRACTOR (categoryId)
 * @method getCategoryById
 * @summary Middleware Helper methods to set the category to req.category
 */
exports.getCategoryById = (req, res, next, id) => {
  Catogory.findById(id).exec((err, category) => {
    if (err || !category)
      return res.status(400).json({ error: 'No category found in DB' });
    req.category = category; //Creating a category key in req object explicitely
    next();
  });
};

/**
 * @method createCategory
 * @summary Create the category by a user by validating that user rights
 * @access Private
 * @route POST /api/category/create/:userId
 */
exports.createCategory = async (req, res) => {
  const category = new Catogory(req.body);
  try {
    //Check if exists
    const categoryExist = await Catogory.findOne({
      name: req.body.name
    }).collation({ locale: 'en', strength: 1 });
    if (categoryExist)
      return res
        .status(400)
        .json({ error: `Category already exists with name ${req.body.name}` });

    //Make a new category
    const response = await category.save();
    if (!response)
      return res.status(400).json({
        error: 'Not able to save category in DB'
      });
    return res.json({ category: response });
  } catch (err) {
    console.log(err);
    return res.status(500).send('Internal server error');
  }
};

/**
 * @method getCategory
 * @summary Get the category by cateogoryId
 * @access Public
 * @route GET /api/category/:categoryId
 */

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

/**
 * @method getAllCategories
 * @summary Get all the categories
 * @access Public
 * @route GET /api/categories
 */
exports.getAllCategories = (req, res) => {
  Catogory.find({}).exec((err, categories) => {
    if (err || !categories)
      return res.status(400).json({ error: 'No category found in DB' });
    return res.json(categories);
  });
};

/**
 * @method updateCategory
 * @summary Update the category
 * @access Private
 * @route PUT /api/category/:categoryId/:userId
 */
exports.updateCategory = (req, res) => {
  try {
    const category = req.category;
    category.name = req.body.name;
    //Since req.category is an object from the database
    category.save((err, updatedCategory) => {
      if (err)
        return res.status(400).json({ error: 'Failed to update category' });
      return res.json(updatedCategory);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send('Internal server error');
  }
};

/**
 * @method removeCategory
 * @summary Remove the category
 * @access Private
 * @route DELETE /api/category/:categoryId/:userId
 */
exports.removeCategory = (req, res) => {
  try {
    //Since req.category is an object from the database
    const category = req.category;
    category.remove((err, category) => {
      if (err)
        return res
          .status(400)
          .json({ error: `Failed to delete ${req.category.name} category` });
      return res.json({ message: `${category.name} successfully Deleted` });
    });
  } catch (err) {
    onsole.log(err);
    return res.status(500).send('Internal server error');
  }
};
