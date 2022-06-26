const path = require("path");

// 개발 환경 모드
const mode = process.env.NODE_ENV || "development";

// 파일 확장자명 정규표현식
const tsRegex = /\.ts$/;

// path를 이용한 경로 지정
const entryPoint = path.join(__dirname, "src", "index.ts");
const buildPoint = path.join(__dirname, "dist");
const aliasPoint = path.join(__dirname, "src");

module.exports = {
  name: "file-upload-preprocessor",
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
    clean: true,
  },
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
