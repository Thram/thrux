/**
 * Created by thram on 18/01/17.
 */
import {join} from 'path';

const include = join(__dirname, 'src');

export default {
  entry  : './src/index',
  output : {
    path         : join(__dirname, 'dist'),
    libraryTarget: 'umd',
    library      : 'thrux',
  },
  devtool: 'source-map',
  module : {
    loaders: [
      {test: /\.js$/, loader: 'babel', include}
    ]
  }
};