import * as rand from '../rand';
import * as maps from '../maps';
import exps from '../exps';
import File from './File';

type Literal = {
  marker: string;
  full: string;
  inner: string;
}

export default class Instance {
  public src: string;
  public literalsList: Literal[] = [];
  public scriptsList: string[] = [];
  public stylesList: string[] = [];

  constructor(
    public file: File,
    props: Map<string, string>
  ) {
    this.src = file.content
      .replace(exps.slotExp, (full, key) => {
        if(props.has(key))
          return props.get(key);
        return full;
      })
      .replace(exps.literalExp, (full, q, inner) => {
        const marker = `__${file.id}-${rand.str(13)}__`;
        this.literalsList.push({marker, full, inner});
        return marker;
      })
      .replace(exps.scriptExp, (full, tag, inner) => {
        if(exps.srcAttExp.test(full))
          return full;
        this.scriptsList.push(inner);
        return '';
      })
      .replace(exps.styleExp, (full, tag, inner) => {
        this.stylesList.push(inner);
        return '';
      });
  }

  // Smelly justInner?
  applyLiterals(src: string, onlyInner: boolean = false) {
    return this.literalsList.reduce(
      (acc, {marker, full, inner}) => {
        const exp = new RegExp(marker, 'g');
        if(!exp.test(acc)) return acc;
        return acc.replace(exp, onlyInner ? inner : full);
      }, src);
  }

  applyLiteralsToAtts(atts: Map<string, string>) {
    const copy = new Map<string, string>();
    atts.forEach((val, key) =>
      copy.set(key, this.applyLiterals(val, true)));
    return copy;
  }

  get scripts() {
    return this.scriptsList.reduce((acc, script) =>
      acc + `(function() {\n${script}\n})();\n`, '');
  }

  get styles() {
    return this.stylesList.reduce((acc, style) =>
      acc + style, '');
  }
}
