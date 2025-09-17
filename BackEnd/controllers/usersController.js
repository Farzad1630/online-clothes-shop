const sql = require("mssql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dbConfig = require("../config/db");

// 📌 ثبت‌نام
const registerUser = async (req, res) => {
  const { fullName, email, phone, addressLine, password } = req.body;

  try {
    const pool = await sql.connect(dbConfig);

    // چک کنیم ایمیل تکراری نباشه
    const checkUser = await pool
      .request()
      .input("Email", sql.NVarChar, email)
      .query("SELECT * FROM Users WHERE Email = @Email");

    if (checkUser.recordset.length > 0) {
      return res.status(400).json({ message: "ایمیل قبلا استفاده شده است" });
    }

    // هش کردن پسورد
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ذخیره در دیتابیس
    await pool
      .request()
      .input("FullName", sql.NVarChar, fullName)
      .input("Email", sql.NVarChar, email)
      .input("Phone", sql.NVarChar, phone)
      .input("AddressLine", sql.NVarChar, addressLine)
      .input("PasswordHash", sql.VarBinary,hashedPassword)
      .query(
        "INSERT INTO Users (FullName, Email, Phone, AddressLine, PasswordHash) VALUES (@FullName, @Email, @Phone, @AddressLine, @PasswordHash)"
      );

    res.status(201).json({ message: "ثبت‌نام موفقیت‌آمیز بود" });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "خطا در ثبت‌نام" });
    console.error("Login Error:", error.message, error);

  }
};

// 📌 ورود
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool
      .request()
      .input("Email", sql.NVarChar, email)
      .query("SELECT * FROM Users WHERE Email = @Email");

    if (result.recordset.length === 0) {
      return res.status(400).json({ message: "کاربر پیدا نشد" });
    }

    const user = result.recordset[0];

    // پسورد هش شده رو بررسی کنیم
    const isMatch = await bcrypt.compare(
      password,
      user.PasswordHash.toString()
    );

    if (!isMatch) {
      return res.status(400).json({ message: "ایمیل یا رمز اشتباه است" });
    }

    // ساخت JWT
    const token = jwt.sign(
      { userId: user.UserID, email: user.Email },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );

    res.json({ message: "ورود موفقیت‌آمیز", token });
  } catch (error) {
    console.error("Login Error:", error.message, error);
    console.error("Login Error:", error);
    res.status(500).json({ message: "خطا در ورود" });
  }
};

module.exports = { registerUser, loginUser };
