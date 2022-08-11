const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const FuzzySearch = require("fuzzy-search");

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.wsogi.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

const port = process.env.PORT || 8000;

const productModel = require("./product.model");
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

const searcher = new FuzzySearch(productModel, ["name", "imgUrl"], {
  caseSensitive: true,
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("database connected successfully"))
  .catch((err) => console.log("it has an error", err));

app.post("/", (req, res) => {
  console.log(req.body);
  const saveProduct = productModel({
    name: req.body.name,
    imgUrl: req.body.imgUrl,
  });
  saveProduct
    .save()
    .then((res) => {
      console.log("product is saved");
    })
    .catch((err) => {
      console.log(err, "error has occur");
    });
  res.send("product is saved");
});

app.get("/", async (req, res) => {
  const allData = await productModel.find().select({ name: 1, _id: 0 });
  res.json(allData);
});

app.get("/product", async (req, res) => {
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    const product = await productModel.find({ name: regex });
    res.json(product);
  } else {
    const allData = await productModel.find();
    res.json(allData);
  }
});
app.listen(port, () => {
  console.log("server running successfully");
});
