const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      college,
      course,
      graduationYear,
      password,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !college ||
      !course ||
      !graduationYear ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, result) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Database Error",
          });
        }

        if (result.length > 0) {
          return res.status(400).json({
            success: false,
            message: "Email already exists",
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
          `INSERT INTO users
          (name,email,phone,college,course,graduation_year,password)
          VALUES (?,?,?,?,?,?,?)`,
          [
            name,
            email,
            phone,
            college,
            course,
            graduationYear,
            hashedPassword,
          ],
          (err) => {
            if (err) {
              console.log(err);
              return res.status(500).json({
                success: false,
                message: "Registration Failed",
              });
            }

            res.status(201).json({
              success: true,
              message: "User Registered Successfully",
            });
          }
        );
      }
    );
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ================= LOGIN =================

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and Password are required",
    });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database Error",
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const user = result[0];

      const isMatch = await bcrypt.compare(
        password,
        user.password
      );

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid Password",
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      res.status(200).json({
        success: true,
        message: "Login Successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          college: user.college,
          course: user.course,
          graduationYear: user.graduation_year,
        },
      });
    }
  );
};

// ================= PROFILE =================

const profile = (req, res) => {
  db.query(
    `SELECT
      id,
      name,
      email,
      phone,
      college,
      course,
      graduation_year
    FROM users
    WHERE id = ?`,
    [req.user.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database Error",
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        user: result[0],
      });
    }
  );
};



// ================= UPDATE PROFILE =================

const updateProfile = (req, res) => {

  const {
    name,
    phone,
    college,
    course,
    graduationYear,
  } = req.body;

  db.query(
    `UPDATE users
     SET
        name=?,
        phone=?,
        college=?,
        course=?,
        graduation_year=?
     WHERE id=?`,
    [
      name,
      phone,
      college,
      course,
      graduationYear,
      req.user.id,
    ],
    (err) => {

      if (err) {
        console.log(err);

        return res.status(500).json({
          success: false,
          message: "Profile update failed",
        });
      }

      res.json({
        success: true,
        message: "Profile updated successfully",
      });

    }
  );
};

// ================= CHANGE PASSWORD =================

const changePassword = async (req, res) => {

  const {
    currentPassword,
    newPassword,
  } = req.body;

  db.query(
    "SELECT * FROM users WHERE id=?",
    [req.user.id],
    async (err, result) => {

      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database Error",
        });
      }

      const user = result[0];

      const match = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!match) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      const hashed = await bcrypt.hash(
        newPassword,
        10
      );

      db.query(
        "UPDATE users SET password=? WHERE id=?",
        [hashed, req.user.id],
        (err) => {

          if (err) {
            return res.status(500).json({
              success: false,
              message: "Password update failed",
            });
          }

          res.json({
            success: true,
            message: "Password changed successfully",
          });

        }
      );

    }
  );
};
module.exports = {
  register,
  login,
  profile,
  updateProfile,
  changePassword,
};