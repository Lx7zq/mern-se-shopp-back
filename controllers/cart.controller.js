const CartModel = require("../models/Cart");

// 📌 GET /cart - ดึงสินค้าทั้งหมดในตะกร้า
exports.getAllCarts = async (req, res) => {
  try {
    const carts = await CartModel.find();
    res.json(carts);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Failed to get cart items." });
  }
};

// 📌 POST /carts - เพิ่มสินค้าไปยังตะกร้า
exports.createCart = async (req, res) => {
  const { productId, name, price, image, quantity, email } = req.body;

  if (!productId || !name || !price || !image || !quantity || !email) {
    return res.status(400).json({ message: "Product information is missing!" });
  }

  try {
    const existingItem = await CartModel.findOne({ productId, email });
    if (existingItem) {
      existingItem.quantity += quantity;
      const updatedItem = await existingItem.save();
      return res.json(updatedItem);
    }

    const cart = new CartModel({
      productId,
      name,
      price,
      image,
      quantity,
      email,
    });
    const newItem = await cart.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong!" });
  }
};

// 📌 DELETE /cart - ลบสินค้าทั้งหมดในตะกร้า
exports.deleteAllCarts = async (req, res) => {
  const { email } = req.params;
  try {
    const result = await CartModel.deleteMany({ email });

    if (result.deletedCount > 0) {
      return res.json({ message: "All cart items removed!" });
    } else {
      return res.json({ message: "No cart items found." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Failed to delete cart items." });
  }
};

// 📌 GET /cart/{email} - ดึงสินค้าทั้งหมดของผู้ใช้ตามอีเมล
exports.getCartsByEmail = async (req, res) => {
  try {
    const carts = await CartModel.find({ email: req.params.email });
    res.json(carts);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Failed to get cart items." });
  }
};

// 📌 PUT /cart/{id} - อัปเดตสินค้าตาม ID
exports.updateCartById = async (req, res) => {
  let { quantity } = req.body;

  console.log("Received quantity:", quantity);
  console.log("Type of quantity:", typeof quantity);

  if (quantity === undefined || quantity === null) {
    return res.status(400).json({ message: "Quantity is required!" });
  }

  quantity = Number(quantity); // แปลงเป็น Number

  if (isNaN(quantity) || quantity < 1) {
    return res.status(400).json({ message: "Invalid quantity!" });
  }

  try {
    const updatedItem = await CartModel.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found!" });
    }

    res.json(updatedItem);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Failed to update cart item." });
  }
};

// 📌 DELETE /cart/{id} - ลบสินค้าตาม ID
exports.deleteCartById = async (req, res) => {
  try {
    const item = await CartModel.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found!" });
    }
    res.status(200).json({ message: "Item deleted successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Failed to delete cart item." });
  }
};
