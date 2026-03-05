const path = require("path");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  mode: isProduction ? "production" : "development",
  target: "node",
  entry: "./src/server.js",
  output: {
    filename: "server.js",
    path: path.resolve(__dirname, "dist"),
    clean: true
  },
  devtool: isProduction ? "source-map" : "eval-source-map",
  externalsPresets: { node: true },
  externals: [
    ({ request }, callback) => {
      // Keep node_modules imports external so runtime dependencies resolve from node_modules.
      if (request && /^[a-zA-Z0-9@][a-zA-Z0-9@/._-]*$/.test(request)) {
        return callback(null, `commonjs ${request}`);
      }
      return callback();
    }
  ],
  optimization: {
    minimize: isProduction
  }
};