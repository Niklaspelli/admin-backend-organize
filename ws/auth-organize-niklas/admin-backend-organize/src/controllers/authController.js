const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
  generateCsrfToken,
} = require("../domain/auth_handler");

const adminsFilePath = path.join(__dirname, "../data/admins.json");

const readAdminsFromFile = () => {
  const fileData = fs.readFileSync(adminsFilePath);
  return JSON.parse(fileData);
};

const writeAdminsToFile = (admins) => {
  fs.writeFileSync(adminsFilePath, JSON.stringify(admins, null, 2));
};

exports.register = async (req, res) => {
  const { username, password } = req.body;
  const admins = readAdminsFromFile();

  if (admins.find((admin) => admin.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newAdmin = { username, password: hashedPassword };

  admins.push(newAdmin);

  writeAdminsToFile(admins);
  res.json({ message: "Admin registered successfully!" });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const admins = readAdminsFromFile();

  const admin = admins.find((u) => u.username === username);

  if (admin && (await bcrypt.compare(password, admin.password))) {
    const accessToken = generateAccessToken({ username, role: "admin" });
    const refreshToken = generateRefreshToken({ username, role: "admin" });
    const csrfToken = generateCsrfToken();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.SECURE === "true",
      maxAge: 15 * 60 * 1000,
      sameSite: process.env.SAME_SITE,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.SECURE === "true",
      maxAge: 15 * 60 * 1000,
      sameSite: process.env.SAME_SITE,
    });

    return res.json({ csrfToken });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  res.status(200).json({ message: "Logout successful" });
};
