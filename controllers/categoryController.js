import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(201).send({ message: "Category name is required" });
    }
    // checking existing category
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res
        .status(201)
        .send({ message: "This Category is already exists" });
    }
    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();

    return res.status(200).send({
      success: true,
      message: "Category created successfully.",
      category,
    });
  } catch (error) {
    return res.status(205).send({
      message: "Internal Server Error",
      success: false,
      error,
    });
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Update category successfully.",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error while updating category",
      error,
    });
  }
};

export const getAllCategory = async (req, res) => {
  try {
    const allCategory = await categoryModel.find({});
    res.status(200).send({
      message: "Fetching all category successfully.",
      success: true,
      allCategory,
    });
  } catch (error) {
    res.status(205).send({
      message: "Error While fetching all Category.",
      success: false,
      error,
    });
  }
};

export const getSingleCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const singleCategory = await categoryModel.findOne({ slug });

    res.status(200).send({
      success: true,
      message: "Fetching single category successfully.",
      singleCategory,
    });
  } catch (error) {
    res.status(205).send({
      success: false,
      message: "Error while fetching a Single Category",
      error,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Delete Category Successfully",
      category,
    });
  } catch (error) {
    res.status(205).send({
      success: false,
      message: "Error while Delete Category.",
      error,
    });
  }
};
