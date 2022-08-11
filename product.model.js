const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const FuzzySearch = require("fuzzy-search");

const ProductSchema = new Schema({
  name: String,
  imgUrl: {
    type: String,
  },
});

module.exports = ProductModel = mongoose.model("productModel", ProductSchema);
