import * as categoryService from "../Services/categoryService.js";

//C R U D

export const getCategory = async (req, res) => {
  try {
    const category = await categoryService.getCategory();
    res.status(200).json(category);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error getCategory",
      error: err.message,
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    const categoryData = req.body;

    const newcategory = await categoryService.createCategory(categoryData);
    res.status(201).json(newcategory);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error createCategory",
      error: err.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const categoryid = req.params.id;
    const categoryData = req.body;

    const updateCategory = await categoryService.updateCategory(
      categoryid,
      categoryData
    );
    if (!updateCategory) {
      return res.status(400).json({
        message: "Category not Found",
      });
    }
    res.status(200).json(updateCategory);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error updateCategory",
      error: err.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const deleted = await categoryService.deleteCategory(categoryId);

    if (!deleted) {
      return res.status(404).json({
        message: "Client not Found",
      });
    }
    res.status(200).send("DELETED");
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error deleteCategory",
      error: err.message,
    });
  }
};
