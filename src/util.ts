import chalk from 'chalk';
import YAML from 'yaml';
import { readFileSync } from 'fs';

const colorTag = {
  ERROR: 'red',
  INFO: 'green',
  WARN: 'yellow',
};

export function exit(msg: string, code: number = 1) {
  log(msg, code > 0 ? 'ERROR' : 'INFO');
  process.exit(code);
}

export function log(msg: string, lv: keyof typeof colorTag) {
  const color = colorTag[lv] as 'red';
  const m = `[${now()}][${lv}] ${msg}`;
  console.log(chalk[color](m));
  return m;
}

export function parseYML(file: string) {
  return YAML.parse(readFileSync(file).toString());
}

export function stringifyYML(s: any) {
  return YAML.stringify(s);
}

export function now(sep: string = '-') {
  const date = new Date();

  const fill = (n: number) => (n < 10 ? `0${n}` : n.toString());
  const year = date.getFullYear();
  const month = fill(date.getMonth() + 1);
  const day = fill(date.getDate());

  const hour = fill(date.getHours());
  const minute = fill(date.getMinutes());
  const seconds = fill(date.getSeconds());

  return `${year}${sep}${month}${sep}${day} ${hour}:${minute}:${seconds}`;
}

export function trimObjectKeys(obj: any, char: string) {
  const clone: any = {};
  Object.keys(obj).map((key) => {
    const newKey = key.split(char).filter(Boolean).join(char);
    clone[newKey] = obj[key];
  });
  return clone;
}
