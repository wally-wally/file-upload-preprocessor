const path = require("path");

// 외부 플러그인
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

// 개발 환경 모드
const mode = process.env.NODE_ENV || "development";

// 파일 확장자명 정규표현식
const tsRegex = /\.ts$/;

// path를 이용한 경로 지정
const entryPoint = path.join(__dirname, "src", "index.ts");
const buildPoint = path.join(__dirname, "dist");
const aliasPoint = path.join(__dirname, "src");

module.exports = {
  name: "eat-today",
  mode,
  entry: entryPoint,
  module: {
    rules: [
      {
        test: tsRegex,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
  output: {
    path: buildPoint,
    filename: "index.min.js",
    library: {
      type: "umd",
    },
  },
  plugins: [new CleanWebpackPlugin()],
  resolve: {
    alias: {
      "@": aliasPoint,
    },
    extensions: [".js", ".ts"],
  },
  optimization: {
    minimize: true,
  },
};
