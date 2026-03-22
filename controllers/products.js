const Products = require("../models/products");

exports.createProduct = async (req, res) => {
  try {
    const product = await Products.create({
      ...req.body,
      added_by: req.user.id,
      last_updated_by: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Product created",
      data: product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Products.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.update({
      ...req.body,
      last_updated_by: req.user.id,
    });
    await product.reload();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Products.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.update({
      is_deleted: 1,
      deleted_at: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Products.findAndCountAll({
      limit,
      offset,
      order: [["created_at", "DESC"]], // Optional: change as needed
      where: {
        is_deleted: 0,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Products fetched",
      data: rows,
      meta: {
        totalItems: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching Products:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.getProductById = async (req, res) => {
  const ProductsId = req.params.id;

  try {
    const Product = await Products.findByPk(ProductsId);
    if (!Product) {
      return res.status(404).json({
        success: false,
        message: "Products not found",
      });
    }
    return res
      .status(200)
      .json({ success: true, message: "Products fetched", data: Product });
  } catch (error) {
    console.error("Error fetching Products:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
