import * as path from 'path';
import {build} from '../src';

const config = {
  root: 'example',
  entry: ['pages.index', 'pages.about'],
  props: {
    author: 'Tariq Qubti',
    primary: '#333',
    secondary: '#e33',
  },
  output: path.resolve('example', '_out'),
};
build(config);
