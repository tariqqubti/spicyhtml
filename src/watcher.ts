import * as path from 'path';
import * as chokidar from 'chokidar';

export const start = (
  root: string,
  fn: Function
) => {
  console.log(`Watching ${path.resolve(root)}...`);
  fn();
  const watcher = chokidar.watch(root, {
    awaitWriteFinish: {
      stabilityThreshold: 500,
      pollInterval: 100,
    }
  });

  let timeoutId;
  watcher.on('change', path => {
    if(!timeoutId)
      console.log('Rebuilding...');
    console.log(`${path} changed`);
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn();
      timeoutId = null;
    }, 200);
  });
};
