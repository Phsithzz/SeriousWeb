import * as productService from "../Services/productService.js";

export const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    const newproduct = await productService.createProduct(productData);
    res.status(201).json(newproduct);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error createProduct",
      error: err.message,
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await productService.getProduct();
    res.status(200).json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error getProduct",
      error: err.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const productData = req.body;

    const updateProduct = await productService.updateProduct(
      productId,
      productData
    );

    if (!updateProduct) {
      return res.status(400).json({
        message: "Product not Found",
      });
    }
    res.status(200).json(updateProduct);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error updateProduct",
      error: err.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const deleted = await productService.deleteProduct(productId);

    if (!deleted) {
      return res.status(404).json({
        message: "Product not Found",
      });
    }

    res.status(200).send("DELETED");
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error deleteProduct",
      error: err.message,
    });
  }
};

export const searchProduct = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const product = await productService.searchProduc(searchTerm);

    res.status(200).json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error searchProduct",
      error: err.message,
    });
  }
};
