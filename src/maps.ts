export type Pair<K, V> = {
  key: K;
  val: V;
};

export const map = <K, V, Ki, Vi>(
  cb: (val: V, key: K) => Pair<Ki, Vi>,
  input: Map<K, V>
): Map<Ki, Vi> => {
  const output = new Map<Ki, Vi>();
  input.forEach((v, k) => {
    const {key, val} = cb(v, k);
    output.set(key, val);
  });
  return output;
};

export const filter = <K, V>(
  cb: (val: V, key: K) => boolean,
  input: Map<K, V>
): Map<K, V> => {
  const output = new Map<K, V>();
  input.forEach((val, key) => {
    if(cb(val, key) === true)
      output.set(key, val);
  });
  return output;
};

export const clone = <K, V>(input: Map<K, V>) => {
  return map((val, key) => ({key, val}), input);
};

export const merge = <K, V>(...input: Map<K, V>[]) => {
  const merged = new Map<K, V>();
  input.forEach(_map =>
    _map.forEach((val, key) =>
      merged.set(key, val)));
  return merged;
};

export const reduce = <K, V, O>(
  cb: (acc: O, val: V, key: K) => O,
  initial: O,
  input: Map<K, V>
) => {
  let output = initial;
  input.forEach((val, key) => {
    output = cb(output, val, key);
  });
  return output;
};

export const fromObj = <V>(obj: {[i: string]: V}) => {
  const output = new Map<string, V>();
  for(let key in obj) {
    if(!obj.hasOwnProperty(key))
      continue;
    output.set(key, obj[key]);
  }
  return output;
};
