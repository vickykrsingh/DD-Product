import slugify from "slugify";
import fs from "fs";
import productModel from "../models/productModel.js";

export const createProductController = async (req, res) => {
  try {
    const { name, description, slug, category, quantity, price, shipping } =
      req.fields;
    const { photo } = req.files;

    if (!name) {
      return res.status(201).send({ message: "Product Name is required" });
    }
    if (!description) {
      return res
        .status(201)
        .send({ message: "Product Description is required" });
    }
    if (!category) {
      return res.status(201).send({ message: "Product Category is required" });
    }
    if (!quantity) {
      return res.status(201).send({ message: "Product Quantity is required" });
    }
    if (!price) {
      return res.status(201).send({ message: "Product Price is required" });
    }
    if (!shipping) {
      return res.status(201).send({ message: "Shipping Status is required" });
    }
    if (photo && photo.size > 1000000) {
      return res.status(201).send({ message: "Size of Photo Must less than 1MB" });
    }

    const product = new productModel({ ...req.fields, slug: slugify(name) });

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    } else {
      return res.status(201).send({ message: "Product Photo is required" });
    }
    await product.save();

    return res.status(200).send({
      success: true,
      message: "Product Created Successfully.",
      product,
    });
  } catch (error) {
    res.status(205).send({
      success: false,
      message: "Internal Server Error.",
      error,
    });
  }
};

export const getAllProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(8)
      .sort({ createdAt: -1 });
    res.status(201).send({
      success: true,
      message: "All Products",
      productLength: products.length,
      products,
    });
  } catch (error) {
    res.status(205).send({
      success: false,
      message: "Error While fetching All Product",
      error,
    });
  }
};

export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findById(req.params.id)
      .select("-photo")
      .populate("category");
    res.status(201).send({
      success: true,
      message: "Single Product",
      product,
    });
  } catch (error) {
    res.status(205).send({
      success: false,
      message: "Error While fetching Single product",
      error,
    });
  }
};

export const photoController = async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = await productModel.findById(pid).select("photo");

    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      res.status(201).send(product.photo.data);
    }
  } catch (error) {
    res.status(205).send({
      success: false,
      message: "Error while fetching product photo",
      error,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(201).send({
      success: true,
      message: "Deleting product Successfully",
    });
  } catch (error) {
    res.status(205).send({
      success: false,
      message: "Error While deleting product",
      error,
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { name, description, slug, category, quantity, price, shipping } =
      req.fields;
    const { photo } = req.files;

    if (!name) {
      return res.status(201).send({ message: "Product Name is required" });
    }
    if (!description) {
      return res
        .status(201)
        .send({ message: "Product Description is required" });
    }
    if (!category) {
      return res.status(201).send({ message: "Product Category is required" });
    }
    if (!quantity) {
      return res.status(201).send({ message: "Product Quantity is required" });
    }
    if (!price) {
      return res.status(201).send({ message: "Product Price is required" });
    }
    if (!shipping) {
      return res.status(201).send({ message: "Shipping Status is required" });
    }
    if (photo && photo.size > 1000000) {
      return res.status(201).send({ message: "Product Photo is required" });
    }

    const product = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();

    return res.status(200).send({
      success: true,
      message: "Product Updated Successfully.",
      product,
    });
  } catch (error) {
    res.status(205).send({
      success: false,
      message: "Error While updating product.",
      error,
    });
  }
};

export const productFilter = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Something went wrong while filtering product",
    });
  }
};

// Fetch the number of total products

export const totalProduct = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error While fetching total number of product",
      error,
    });
  }
};

// per page products

export const perPageProduct = async (req, res) => {
  try {
    const perPageProductLimit = 8;
    const currentPage = req.params.page ? req.params.page : 1;

    const products = await productModel
      .find({})
      .select("-photo")
      .skip((currentPage - 1) * perPageProductLimit)
      .limit(perPageProductLimit)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error While fetching per page product",
      error,
    });
  }
};

// Search Product Controller

export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const products = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.status(200).send({
      success: true,
      message: "Search Result",
      products,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error while searching product",
      error: error.message,
    });
  }
};

// Similar Products

export const similarProduct = async (req, res) => {
  try {
    const cid = req.params.cId;
    const products = await productModel.find({ category: cid })
    res.status(200).send({
      success: true,
      message: "Similar Product fetched successfully.",
      products,
    });
  } catch (error) {
    res.status(205).send({
      success: false,
      message: "Error while fetching similar product",
      error: error.message,
    });
  }
};

