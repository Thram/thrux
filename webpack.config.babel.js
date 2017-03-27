/**
 * Created by thram on 18/01/17.
 */
import { join } from 'path';

const include = join(__dirname, 'src');

export default function (env = {}) {
  return {
    entry: { thrux: './src/index', 'thrux.fp': './src/fp/index' },
    output: {
      path: join(__dirname, 'dist'),
      libraryTarget: 'umd',
      library: 'thrux',
      filename: env.prod ? '[name].umd.min.js' : '[name].umd.js',
    },
    devtool: 'source-map',
    module: {
      loaders: [
        { test: /\.js$/, loader: 'babel-loader', include },
      ],
    },
  };
}
