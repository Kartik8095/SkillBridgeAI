const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
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
          return res.status(500).json(err);
        }

        if (result.length > 0) {
          return res.status(400).json({
            success: false,
            message: "Email already exists",
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
          "INSERT INTO users(name,email,password) VALUES(?,?,?)",
          [name, email, hashedPassword],
          (err) => {
            if (err) {
              return res.status(500).json(err);
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
      if (err) return res.status(500).json(err);

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const user = result[0];

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid Password",
        });
      }

      // DEBUG
      console.log("LOGIN SECRET:", process.env.JWT_SECRET);

      const token = jwt.sign(
        {
          id: user.id,
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
        },
      });
    }
  );
};

// ================= PROFILE =================

const profile = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to SkillBridge AI",
    user: req.user,
  });
};

module.exports = {
  register,
  login,
  profile,
};