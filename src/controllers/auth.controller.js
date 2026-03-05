const authService = require("../services/auth.service");

const signup = async (req, res, next) => {
  try {
    const result = await authService.signup(req.body);
    return res.status(201).json({
      message: "User registered successfully",
      data: result
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return res.status(200).json({
      message: "Login successful",
      data: result
    });
  } catch (error) {
    return next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const result = await authService.refreshAccessToken(req.body.refreshToken);
    return res.status(200).json({
      message: "Access token refreshed",
      data: result
    });
  } catch (error) {
    return next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await authService.logout(req.body.refreshToken);
    return res.status(200).json({
      message: "Logout successful"
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  signup,
  login,
  refreshToken,
  logout
};
