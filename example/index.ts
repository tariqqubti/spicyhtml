import * as path from 'path';
import {watch} from '../src';

const config = {
  root: 'example',
  entry: ['pages.index', 'pages.about'],
  props: {
    author: 'Tariq Qubti',
    primary: '#eee',
    secondary: '#f44',
  },
  /**
   * TODO: Check output dir is outside root
   * to prevent infinite loop
   */
  output: path.resolve('example_out'),
};
watch(config);
