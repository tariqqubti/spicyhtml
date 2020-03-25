import * as re from './re';
import exps from './exps';
import msgs from './msgs';

type Tag = {
  index: number;
  len: number;
  name: string;
  atts: string;
  close: string;
  self: string;
};

const tokenize = (src: string): Tag[] => {
  return re.map(exps.refTagExp, match => {
    const full = match[0];
    const index = match.index;
    const len = full.length;
    const parts = full.match(exps.refTagPartsExp);
    const {name, atts, close, self} = parts.groups;
    return {index, len, name, atts, close, self};
  }, src);
};

class Ref {
  constructor(
    public open: Tag,
    public close: Tag,
  ) {}
  get name() {
    return this.open.name;
  }
  get start() {
    return this.open.index;
  }
  get end() {
    if(this.close)
      return this.close.index + this.close.len;
    return this.open.index + this.open.len;
  }
  get atts() {
    const atts = new Map<string, string>();
    if(!this.open.atts) return atts;
    const clean = this.open.atts.trim()
      .replace(/\s+=\s+/g, '=')
      .replace(/\s+/g, ' ');
    if(!clean) return atts;
    clean.split(' ').forEach(arr => {
      const [key, val] = arr.split('=');
      if(key === '') return;
      atts.set(key, typeof val === undefined ? 'true' : val);
    });
    return atts;
  }
  inner(src: string) {
    if(!this.close) return '';
    return src.substring(
      this.open.index + this.open.len,
      this.close.index
    );
  }
}

const parse = (tags: Tag[]): Ref[] => {
  const refs: Ref[] = [];
  const stack: Tag[] = [];
  tags.forEach(tag => {
    if(tag.self) {
      refs.push(new Ref(tag, null));
    } else if(tag.close) {
      const open = stack.pop();
      if(!open || open.name !== tag.name)
        throw new Error(msgs.missingOpenTag(tag.name));
      refs.push(new Ref(open, tag));
    } else {
      stack.push(tag);
    }
  });
  return refs;
};

export const sorted = (src: string): Ref[] => {
  const refs = parse(tokenize(src));
  return refs.sort((a, b) => {
    if(a.start < b.start) return -1;
    if(a.start > b.start) return 1;
    return 0;
  });
};

export const first = (src: string): Ref => {
  const refs = sorted(src);
  if(!refs || !refs.length) return null;
  return refs.reduce((min, ref) =>
    ref.open.index < min.open.index ? ref : min);
};
