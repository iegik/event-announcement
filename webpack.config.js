module.exports = {
  context: __dirname,
  "entry": "./js/index.js",
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  "module": {
    "loaders": [
      {
        test: /\.less$/,
        loader: "style!css!less"
      },
      {
        "test": /\.(jpe?g|png|gif|svg|ico|ttf|eot|woff2?|mp4)$/,
        "loader": "file?name=[path][name].[ext]"
      }
    ]
  }
};
