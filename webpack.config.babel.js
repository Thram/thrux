/**
 * Created by thram on 18/01/17.
 */
import {join} from "path";
import HtmlwebpackPlugin from "html-webpack-plugin";

const INDEX_HTML_SETUP = {
  template  : 'node_modules/html-webpack-template/index.ejs',
  title     : 'Thrux Docs',
  appMountId: 'thrux-docs',
  mobile    : true,
  inject    : false
};

export default {
  entry  : './src/index',
  output : {
    path    : __dirname,
    filename: '[name].js'
  },
  devtool: 'source-map',
  module : {
    rules: [
      {test: /\.js$/, loader: 'babel-loader'},
      {test: /\.md$/, loader: 'raw-loader'},
      {
        test: /\.sass$/,
        use : [{
          loader: "style-loader" // creates style nodes from JS strings
        }, {
          loader: "css-loader" // translates CSS into CommonJS
        }, {
          loader: "sass-loader" // compiles Sass to CSS
        }]
      }]
  },
  plugins: [
    new HtmlwebpackPlugin(INDEX_HTML_SETUP)
  ]
};