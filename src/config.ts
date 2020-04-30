import chokidar from 'chokidar';
import { resolve, basename } from 'path';
import { readdirSync, existsSync, statSync } from 'fs';
import { exit, parseYML, log, trimObjectKeys } from './util';

const config: { [K: string]: any } = {};
let fileWatcher: chokidar.FSWatcher | null = null;

export function setup(path: string) {
  if (!existsSync(path)) {
    exit(`path "${path}" does not exists`);
  }

  const ps = statSync(path);
  if (!ps.isDirectory()) {
    exit(`path is not a directory`);
  }

  const list = readdirSync(path)
    .filter((v) => v.slice(-4) === '.yml')
    .map((v) => resolve(path, v));

  list.forEach(setConfig);

  watchingPath(path);
}

export function getConfig(scope: string, path: string[]) {
  const sc = config[scope];
  if (!sc) return null;
  if (!path.length) return null;

  const matched = Object.keys(sc)
    .map((v) => v.split('/'))
    .filter(
      (v) =>
        path.filter((p, i) => v[i] && (v[i][0] === ':' || p == v[i])).length ===
        path.length,
    )[0];

  if (matched) {
    const variables: any = {};
    matched.forEach((p, i) => {
      if (p[0] === ':') {
        variables[p.slice(1)] = path[i];
      }
    });
    const res = { ...sc[matched.join('/')], variables };
    return res;
  }
  return null;
}

function watchingPath(path: string) {
  fileWatcher = chokidar
    .watch(path, { ignoreInitial: true, depth: 1 })
    .on('change', setConfig)
    .on('add', setConfig)
    .on('unlink', removeConfig);
}

export function stopWatchingPath() {
  if (!fileWatcher) return;
  fileWatcher.close();
}

function setConfig(path: string) {
  try {
    const name = basename(path).slice(0, -4);
    config[name] = trimObjectKeys(parseYML(path) || {}, '/');
  } catch (e) {
    log(`can not parse ${path}, message: ${e}`, 'WARN');
  }
}

function removeConfig(path: string) {
  delete config[path];
}

export function hasScope(scope: string) {
  return !!config[scope];
}
