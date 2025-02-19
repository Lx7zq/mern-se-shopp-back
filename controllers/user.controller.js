const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
const salt = bcrypt.genSaltSync(10);
require("dotenv").config();
const secret = process.env.SECRET;

exports.sign = async (req, res) => {
  try {
    const { email } = req.body;
    // 1. ตรวจสอบว่าได้ส่ง email มาหรือไม่
    if (!email) {
      return res.status(400).json({ message: "Email is required!" });
    }
    // 2. ค้นหา email ในฐานข้อมูล
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email is not found!" });
    }
    // 3. สร้าง JWT token
    const token = jwt.sign(
      { email: user.email, role: user.role },
      process.env.SECRET,
      { expiresIn: "1h" }
    );
    const userInfo = { token, email: user.email, role: user.role };
    res.status(200).json({ userInfo });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.addUser = async (req, res) => {
  const { email } = req.body;
  // 1. ตรวจสอบว่าได้ส่ง email มาหรือไม่
  if (!email) {
    return res.status(400).json({ message: "Email is required!" });
  }

  try {
    // 2. ตรวจสอบว่า email มีอยู่ในระบบแล้วหรือไม่
    const existedUser = await UserModel.findOne({ email });

    if (existedUser) {
      return res.status(409).json({ message: "Email already exists!" });
    }

    // 3. เพิ่มผู้ใช้ใหม่
    const user = new UserModel({ email });
    await user.save();

    res.status(201).json({ message: "User created successfully!", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
