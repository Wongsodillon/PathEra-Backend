import Users from "../model/Users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserController {
  static async register(req, res) {
    try {
      const { name, email, password, confirm_password } = req.body;
      const errors = {};
      const existingUser = await Users.findOne({ where: { email } });
      if (!name) {
        errors.name = "Name is required!";
      } else if (name.length < 3) {
        errors.name = "Name must be at least 3 characters!";
      }
      if (!email) {
        errors.email = "Email is required!";
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = "Email is in an invalid format!";
      } else if (existingUser) {
        errors.email = "Email already exists!";
      }
      if (!password) {
        errors.password = "Password is required!";
      } else if (password.length < 8) {
        errors.password = "Password must be at least 8 characters!";
      }
      if (password !== confirm_password) {
        errors.cpassword = "Passwords do not match!";
      }

      if (Object.keys(errors).length > 0) {
        console.log(errors);
        return res.status(400).json({ errors });
      }

      const hashedPassword = await bcrypt.hash(password, 8);
      const user = await Users.create({
        name,
        email,
        password: hashedPassword,
      });

      return res.status(201).json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const errors = {};

      if (!email) errors.email = "Email is required!";
      if (!password) errors.password = "Password is required!";

      const user = await Users.findOne({ where: { email } });

      if (!user) {
        errors.email = "Email not found!";
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: { password: "Password is incorrect!" } });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      await Users.update({ token }, { where: { id: user.id } });

      res.status(200).json({ token });
    } catch (error) {
      console.error("Error in login:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async auth(req, res) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res
          .status(401)
          .json({ message: "Authorization header missing" });
      }

      const token = authHeader.split(" ")[1];
      const user = await Users.findOne({ where: { token } });

      if (!user) {
        return res.status(400).json({ message: "Invalid token!" });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateProfile(req, res) {
    try {
      const { name, email, password, degree, years_of_experience } = req.body;
      const userId = req.userId;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
      }

      const updateData = {};

      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (password) {
        if (password.length < 8) {
          return res
            .status(400)
            .json({ message: "Password must be at least 8 characters." });
        }
        updateData.password = await bcrypt.hash(password, 8);
      }
      if (degree) updateData.degree = degree;
      if (years_of_experience)
        updateData.years_of_experience = years_of_experience;

      if (Object.keys(updateData).length === 0) {
        return res
          .status(400)
          .json({ message: "No valid data provided to update." });
      }

      const affectedRows = await Users.update(updateData, {
        where: { id: userId },
      });

      if (affectedRows[0] === 0) {
        return res
          .status(404)
          .json({ message: "User not found or no changes made." });
      }

      const updatedUser = await Users.findByPk(userId);

      res
        .status(200)
        .json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
      console.error("Error updating profile:", error.message);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }

  static async logout(req, res) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res
          .status(401)
          .json({ message: "Authorization header missing" });
      }

      const token = authHeader.split(" ")[1];
      const user = await Users.findOne({ where: { token } });

      if (!user) {
        return res.status(400).json({ message: "Invalid token!" });
      }

      await Users.update({ token: null }, { where: { id: user.id } });

      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default UserController;
