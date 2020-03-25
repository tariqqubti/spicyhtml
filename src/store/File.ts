import * as fs from 'fs';
import * as path from 'path';
import * as arr from '../arr';
import Store from './Store';
import Instance from './Instance';

export default class File {
  public instances: Instance[] = [];
  public path: string;
  public name: string;
  public content: string;

  constructor(
    store: Store,
    public id: string
  ) {
    const parts = id.split('.');
    const rel = parts.slice(0, -1);
    this.name = arr.last(parts) + '.html';
    this.path = path.resolve(store.root, ...rel, this.name);
    if(!fs.existsSync(this.path))
      throw new Error(`File ${this.path} not found`);
    this.content = fs.readFileSync(this.path, 'utf8');
  }

  apply(props: Map<string, string>) {
    const instance = new Instance(this, props);
    this.instances.push(instance);
    return instance;
  }

  applyLiterals(src: string) {
    return this.instances.reduce((acc, instance) =>
      instance.applyLiterals(acc), src);
  }

  get scripts() {
    const scripts = this.instances[0].scripts;
    if(!scripts) return '';
    return `/* ${this.id} */\n` + scripts;
  }

  get styles() {
    const styles = this.instances[0].styles;
    if(!styles) return '';
    return `/* ${this.id} */\n` + styles;
  }
}