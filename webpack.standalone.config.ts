import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

/* We are basically telling webpack to take index.js from entry. Then check for all file extensions in resolve. 
After that apply all the rules in module.rules and produce the output and place it in main.js in the public folder. */

// this is for future, is not meant to be used!!! also it is for development mode
export default {
  mode: "development",
  entry: "./src/renderer/renderer.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  target: "web",
  devServer: {
    port: "3000",
    static: {
      directory: path.join(__dirname, "dist"),
    },
    open: true,
    hot: true,
    liveReload: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "renderer", "index.html"),
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    alias: {
      Assets: path.resolve(__dirname, "src", "static"),
      Renderer: path.resolve(__dirname, "src", "renderer"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // kind of file extension this rule should look for and apply in test
        exclude: /node_modules/, // folder to be excluded
        use: "babel-loader", // loader which we are going to use
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
