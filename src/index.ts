import * as fs from 'fs';
import * as path from 'path';
import * as watcher from './watcher';
import * as refs from './refs';
import * as maps from './maps';
import * as arr from './arr';
import * as str from './str';
import msgs from './msgs';
import Store from './store/Store';

// Singleton across builds, clears cache on watch
const store = new Store;

class Config {
  root: string = 'src';
  entry: string | string[] = 'index';
  props: {[i: string]: string} = {};
  output: string = 'dist';
}

export const watch = ({
  root, entry, props, output
}: Config) => {
  watcher.start(root, () => build({root, entry, props, output}));
};

export const build = ({
  root, entry, props, output
}: Config = new Config) => {
  store.clear();
  store.root = root;
  if(typeof entry === 'string')
    entry = [entry];
  entry.forEach(id => {
    const src = finish(compile(id, maps.fromObj(props)));
    const outputPath = path.resolve(output, arr.last(id.split('.')));
    fs.writeFileSync(outputPath + '.html', src);
  });
};

const compile = (
  id: string,
  props: Map<string, string>,
) => {
  const file = store.put(id);
  const instance = file.apply(props);
  let output = instance.src;
  let ref = refs.first(output);
  while(ref) {
    const atts = instance.applyLiteralsToAtts(ref.atts);
    const merged = maps.merge(props, atts);
    let built = compile(ref.name, merged);
    built = built.replace(/__inner__/g, ref.inner(output));
    output = str.insertAt(built, output, ref.start, ref.end);
    ref = refs.first(output);
  }
  return output;
};

const finish = (src: string) => {
  let output = src;
  let head = output.indexOf('</head');
  if(head === -1) {
    console.warn(msgs.noHeadTag);
    head = 0;
  }
  output = str.insertAt(store.styles, output, head);
  let body = output.indexOf('</body');
  if(body === -1) {
    console.warn(msgs.noBodyTag);
    body = output.length - 1;
  }
  output = str.insertAt(store.scripts, output, body);
  return store.applyLiterals(output);
};
