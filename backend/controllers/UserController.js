const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email.trim() || !password.trim()){
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email, name: user.name, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if(!name.trim() || !username.trim() || !email.trim() || !password.trim()){
      return res.status(400).json({ message: "All fields are required" });
    }
    const role = req.body.role;
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "An account with this email address already exists." });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "This username is already taken. Please choose another one." });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      username,
      email,
      password: hashedPassword,
      role: "Buyer",
      savedProperties: []
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email, name: user.name, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const toggleSavedProperty = async (req, res) => {
  try {
    const { propertyId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isSaved = user.savedProperties.includes(propertyId);

    if (isSaved) {
      user.savedProperties = user.savedProperties.filter(id => id.toString() !== propertyId);
    } else {
      user.savedProperties.push(propertyId);
    }

    await user.save();
    res.status(200).json({ message: isSaved ? "Removed from saved" : "Added to saved", savedProperties: user.savedProperties });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getSavedProperties = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("savedProperties");
    res.status(200).json(user.savedProperties);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  login,
  register,
  toggleSavedProperty,
  getSavedProperties
};