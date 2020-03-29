import * as fs from 'fs';
import * as path from 'path';
import * as watcher from './watcher';
import * as refs from './refs';
import * as maps from './maps';
import * as str from './str';
import msgs from './msgs';
import Store from './store/Store';

// TODO: Refactor

// Singleton across builds, clears cache on watch
const store = new Store;

export class Config {
  root: string = 'src';
  entry: string | string[] = 'index';
  props: {[i: string]: string} = {};
  output: string | Function = 'dist';
}

export const watch = ({
  root, entry, props, output
}: Config = new Config) => {
  watcher.start(root, () => build({root, entry, props, output}));
};

export const build = ({
  root, entry, props, output
}: Config = new Config) => {
  store.clear();
  store.root = root;

  if(typeof entry === 'string')
    entry = [entry];

  const srcs = [];
  entry.forEach(id => {
    const src = finish(compile(id, maps.fromObj(props)));
    srcs.push({id, src});
  });

  if(typeof output === 'string') {
    srcs.forEach(({id, src}) => {
      const outputPath = path.resolve(output, id + '.html');
      fs.writeFileSync(outputPath, src);
    });
  } else if(typeof output === 'function') {
    output(srcs.length === 1 ? srcs[0] : srcs);
  } else {
    if(srcs.length === 1)
      return srcs[0];
    return srcs;
  }
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
    const inner = ref.inner(output);
    if(atts.has('inner') && inner)
      atts.delete('inner');
    const merged = maps.merge(props, atts);
    if(!atts.has('inner'))
      merged.set('inner', instance.applyLiterals(inner));
    let built = compile(ref.name, merged);
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
