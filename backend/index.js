const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
require("dotenv").config();
const port = process.env.PORT;
const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Express App is Running on Port " + port);
});

const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

app.use("/images", express.static("upload/images"));

app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `${baseUrl}/images/${req.file.filename}`,
  });
});

const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product = products[products.length - 1];
    id = last_product.id + 1;
  } else {
    id = 1;
  }
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });
  await product.save();
  console.log("Product added successfully");
  res.json({
    success: true,
    message: "Product added successfully",
    name: req.body.name,
  });
});

app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("Product removed successfully");
  res.json({
    success: true,
    name: req.body.name,
    message: "Product removed successfully",
  });
});

app.get("/getproducts", async (req, res) => {
  let products = await Product.find({});
  console.log("Products fetched successfully");
  res.json({
    success: true,
    products: products,
  });
});

const Users = mongoose.model("Users", {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

app.post("/signup", async (req, res) => {
  try {
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const allProducts = await Product.find({}, "id");
    let cart = {};
    allProducts.forEach((product) => {
      cart[product.id] = 0;
    });

    const user = new Users({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      cartData: cart,
    });
    await user.save();

    const data = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(data, process.env.JWT_SECRET);
    res.json({
      success: true,
      message: "User signed up successfully",
      name: req.body.name,
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.post("/login", async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }
  if (user.password !== req.body.password) {
    return res.status(400).json({
      success: false,
      message: "Invalid password",
    });
  }
  const data = {
    user: {
      id: user.id,
    },
  };
  const token = jwt.sign(data, process.env.JWT_SECRET);
  res.json({
    success: true,
    message: "User logged in successfully",
    name: user.name,
    token: token,
  });
});

app.get("/newcollections", async (req, res) => {
  try {
    const fictionBooks = await Product.find({ category: "fiction" })
      .sort({ _id: -1 })
      .limit(3);

    const nonFictionBooks = await Product.find({ category: "non_fiction" })
      .sort({ _id: -1 })
      .limit(3);
    const childrenBooks = await Product.find({ category: "children" })
      .sort({ _id: -1 })
      .limit(2);

    const newCollections = [
      ...fictionBooks,
      ...nonFictionBooks,
      ...childrenBooks,
    ];

    console.log("New collections fetched successfully");
    res.json({
      success: true,
      newCollections: newCollections,
    });
  } catch (error) {
    console.error("Error fetching new collections:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch new collections",
    });
  }
});

app.get("/bestsellers", async (req, res) => {
  try {
    const fictionBooks = await Product.find({ category: "fiction" })
      .sort({ _id: 1 })
      .limit(2);

    const nonFictionBooks = await Product.find({ category: "non_fiction" })
      .sort({ _id: 1 })
      .limit(1);
    const childrenBooks = await Product.find({ category: "children" })
      .sort({ _id: 1 })
      .limit(1);
    const bestsellers = [...fictionBooks, ...nonFictionBooks, ...childrenBooks];

    console.log("Bestsellers fetched successfully");
    res.json({
      success: true,
      bestsellers: bestsellers,
    });
  } catch (error) {
    console.error("Error fetching bestsellers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bestsellers",
    });
  }
});

const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res
      .status(401)
      .json({ error: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ error: "Please authenticate using a valid token" });
  }
};

app.post("/addtocart", fetchUser, async (req, res) => {
  console.log("added", req.body.itemId);
  let userData = await Users.findOne({ _id: req.user.id });
  if (!userData) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }
  userData.cartData[req.body.itemId]++;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.json({ message: "Item added to cart" });
});

app.post("/removefromcart", fetchUser, async (req, res) => {
  console.log("removed", req.body.itemId);

  let userData = await Users.findOne({ _id: req.user.id });
  if (!userData) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }
  if (userData.cartData[req.body.itemId] > 0)
    userData.cartData[req.body.itemId]--;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.json({ message: "Item removed from cart" });
});

app.post("/getcart", fetchUser, async (req, res) => {
  console.log("Get Cart");
  let userData = await Users.findOne({ _id: req.user.id });
  if (!userData) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }
  console.log("User Data", userData);
  res.json(userData.cartData);
});

app.post("/clearcart", fetchUser, async (req, res) => {
  try {
    const allProducts = await Product.find({}, "id");

    let clearedCart = {};
    allProducts.forEach((product) => {
      clearedCart[product.id] = 0;
    });

    await Users.findOneAndUpdate(
      { _id: req.user.id },
      { cartData: clearedCart }
    );

    console.log("Cart cleared for user:", req.user.id);
    res.json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.listen(port, (error) => {
  if (error) {
    console.log("Error in starting the server" + error);
  } else {
    console.log("Server started on port " + port);
  }
});
