/**
 * Created by thram on 18/01/17.
 */
import {join} from 'path';
import HtmlwebpackPlugin from 'html-webpack-plugin';

const INDEX_HTML_SETUP = {
  template  : 'node_modules/html-webpack-template/index.ejs',
  title     : 'Thrux Docs',
  appMountId: 'thrux-docs',
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
    loaders: [
      {test: /\.js$/, loader: 'babel-loader'},
      {test: /\.md$/, loader: 'raw-loader'},
      {test: /\.css$/, loaders: ['style-loader', 'css-loader']},
    ]
  },
  plugins: [
    new HtmlwebpackPlugin(INDEX_HTML_SETUP)
  ]
};