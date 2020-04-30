#!/usr/bin/env node
import yargs from 'yargs';
import pack from '../package.json';
import { setup } from './config';
import { createServer } from './server';
import { log } from './util';

const argv = yargs
    .option('port', { alias: 'p', description: 'server port', type: 'number' })
    .help(pack.version)
    .version()
    .alias('help', 'h').argv,
  PORT = argv.port || 5000,
  CONFIG_DIR = argv._.pop() || '.';

setup(CONFIG_DIR);

createServer({ port: PORT });
log('Server running in port: ' + PORT, 'INFO');
