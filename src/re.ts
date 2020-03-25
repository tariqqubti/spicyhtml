export type Exp = RegExp;
export type Match = RegExpExecArray;
export type Callback<T> = (match: Match, index: number) => T;

export const any = "[\\s\\S]";
export const capital = "[A-Z][a-zA-Z]*";
export const space = "\\s+";

export const newExp = (exp: string | Exp, flags?: string) =>
  new RegExp(exp, flags);

export const globalize = (exp: Exp) =>
  exp.global ? newExp(exp) : newExp(exp, 'g');

export const esc = (s: string) =>
  s.replace(/[-[\]{}()*+?.,\\^$|]/g, "\\$&");

export const exec = <T>(
  exp: Exp,
  cb: Callback<T>,
  str: string
) => {
  let _exp = exp;
  if(!_exp.global)
    _exp = newExp(exp, 'g');
  let match: Match;
  let i = 0;
  while((match = _exp.exec(str)) !== null) {
    cb(match, i);
    i++;
  }
};

export const map = <T>(
  exp: Exp,
  cb: Callback<T>,
  str: string
): T[] => {
  let output = [];
  exec(exp, (match, i) => {
    output.push(cb(match, i));
  }, str);
  return output;
};

export const matches = (exp: Exp, str: string): Match[] =>
  map(exp, m => m, str);
