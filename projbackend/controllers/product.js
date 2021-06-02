const Product = require('../models/product');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');

/**
 * PARAMETER EXTRACTOR (productId)
 * @method getProductById
 * @summary Middleware Helper methods to set the product to req.product
 */
exports.getProductById = async (req, res, next, id) => {
  try {
    const product = await Product.findById(id).populate('category');
    if (!product) {
      return res.status(400).json({ error: 'No product found for given id' });
    }
    req.product = product;
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).send('Internal server error');
  }
};

/**
 * @method getProduct
 * @summary Get the product by productId
 * @access Public
 * @route GET /api/product/:productId
 */
exports.getProduct = (req, res) => {
  req.product.photo = undefined; //Photo is bulky, so optimizing the GET request
  return res.json(req.product);
};

/**
 * Middleware to parse the photo in the background
 */
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set('Content-Type', req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

/**
 * @method createProduct
 * @summary Create the product by a user by validating that user rights
 * @access Private
 * @route POST /api/product/create/:userId
 */
exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true; //To save the file with extenstions

  //Parses incoming Nodejs request
  form.parse(req, async (err, fields, file) => {
    if (err)
      return res.status(400).json({
        error: 'Problem with Image'
      });

    const { name, description, price, category, stock } = fields;

    if (!name)
      return res.status(400).json({ error: 'Product name is required' });
    if (!description)
      return res.status(400).json({ error: 'Product description is required' });
    if (!price)
      return res.status(400).json({ error: 'Product price is required' });
    if (!category)
      return res.status(400).json({ error: 'Product category is required' });
    if (!stock)
      return res.status(400).json({ error: 'Product stock is required' });

    let product = new Product(fields);

    //Handling the file
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({ error: 'File size too big' }); //3MB
      }

      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    //Save to db
    const response = await product.save();
    if (response) return res.json(product);
    else return res.status(400).json({ error: 'Unable to save the product' });
  });
};

/**
 * @method updateProduct
 * @summary Update the product by productId
 * @access Private
 * @route POST /api/product/create/:userId
 */
exports.updateProduct = async (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true; //To save the file with extenstions

  //Parses incoming Nodejs request
  form.parse(req, async (err, fields, file) => {
    if (err)
      return res.status(400).json({
        error: 'Problem with Image'
      });

    const { name, description, price, category, stock } = fields;

    const product = req.product;
    product = _.extend(product, fields);

    //Handling the file
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({ error: 'File size too big' }); //3MB
      }

      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    //Save to db
    const response = await product.save();
    if (response) return res.json(product);
    else return res.status(400).json({ error: 'Unable to update the product' });
  });
};

/**
 * @method deleteProduct
 * @summary Delete the product by productId
 * @access Private
 * @route DELETE /api/product/:productId/:userId
 */
exports.deleteProduct = (req, res) => {
  try {
    //Since req.product is an object from the database
    const product = req.product;
    product.remove((err, deletedProduct) => {
      if (err)
        return res
          .status(400)
          .json({ error: `Failed to delete ${req.product.name} product` });
      return res.json({
        message: `${deletedProduct.name} successfully Deleted`
      });
    });
  } catch (err) {
    onsole.log(err);
    return res.status(500).send('Internal server error');
  }
};

/**
 * @method getAllProducts
 * @summary Get all the Products
 * @access Public
 * @route GET /api/products
 */
exports.getAllProducts = async (req, res) => {
  const { skip = 0, limit = 10, sortBy = 'id' } = req.query;
  try {
    const response = await Product.aggregate([
      { $project: { photo: 0 } },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      },
      // $lookup returns array of matching documents
      {
        $unwind: { path: '$category', preserveNullAndEmptyArrays: true }
      },
      // $unwind adds the each element of array to the existing collection's document
      { $addFields: { categoryName: '$category.name' } },
      // { $unwind: '$categoryName' },
      {
        $facet: {
          product: [
            { $skip: Number(skip) },
            { $limit: Number(limit) },
            { $sort: { [sortBy]: 1 } }
          ],
          count: [{ $count: 'productCount' }]
        }
      }
    ]);
    return res.json({
      products: response[0].product,
      count: response[0].count[0].productCount
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send('Internal server error');
  }
};

/**
 * @method getAllUniqueCategories
 * @summary Get all the Products' categories
 * @access Public
 * @route GET /products/categories
 */
exports.getAllUniqueCategories = (req, res) => {
  Product.distinct('category', {}, (err, category) => {
    if (err) return res.status(400).json({ error: 'No category found' });
    return res.json(category);
  });
};

/**
 * @method updateStock
 * @summary Middleware to update the stock of a product in cart
 */
exports.updateStock = (req, res, next) => {
  let bulkOperations = req.body.order.products.map(prod => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: {
          $inc: { stock: -prod.count, sold: +prod.count }
        }
      }
    };
  });

  Product.bulkWrite(bulkOperations, {}, (err, products) => {
    if (err) return res.status(400).json({ error: 'Bulk operation failed!' });
    next();
  });
};
