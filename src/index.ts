#!/usr/bin/env node
import yargs from 'yargs';
import pack from '../package.json';
import { setup } from './config';
import { createServer } from './server';
import { log } from './util';

const argv = yargs
  .option('port', { alias: 'p', description: 'server port', type: 'number' })
  .version(pack.version).argv;

const PORT = argv.port || 5000,
  CONFIG_DIR = argv._.pop() || '.';

setup(CONFIG_DIR);

createServer({ port: PORT });
log('Server running in port: ' + PORT, 'INFO');
require('yargs') // eslint-disable-line
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging',
  }).argv;
