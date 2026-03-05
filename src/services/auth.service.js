const bcrypt = require("bcrypt");
const { User } = require("../models");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} = require("../utils/token.utils");

const SALT_ROUNDS = 12;

const toPublicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

const issueTokens = (user) => {
  const payload = { userId: user.id, email: user.email, role: user.role };
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload)
  };
};

const signup = async ({ name, email, password, role = "user" }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("Email already registered");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role
  });

  const tokens = issueTokens(user);
  user.refreshToken = tokens.refreshToken;
  await user.save();

  return {
    user: toPublicUser(user),
    ...tokens
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const tokens = issueTokens(user);
  user.refreshToken = tokens.refreshToken;
  await user.save();

  return {
    user: toPublicUser(user),
    ...tokens
  };
};

const refreshAccessToken = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    const error = new Error("Refresh token is required");
    error.statusCode = 400;
    throw error;
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(incomingRefreshToken);
  } catch (jwtError) {
    const error = new Error("Invalid or expired refresh token");
    error.statusCode = 401;
    throw error;
  }

  const user = await User.findById(decoded.userId);
  if (!user || user.refreshToken !== incomingRefreshToken) {
    const error = new Error("Refresh token is not recognized");
    error.statusCode = 401;
    throw error;
  }

  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role
  });

  return { accessToken };
};

const logout = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    const error = new Error("Refresh token is required");
    error.statusCode = 400;
    throw error;
  }

  await User.findOneAndUpdate({ refreshToken: incomingRefreshToken }, { refreshToken: null });
};

module.exports = {
  signup,
  login,
  refreshAccessToken,
  logout
};
