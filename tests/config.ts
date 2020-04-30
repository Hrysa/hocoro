import { setup, stopWatchingPath } from '../src/config';
import { resolve } from 'path';

describe('test config', () => {
  it('init', () => {
    setup(resolve(__dirname, 'config'));
  });

  it('after all', () => {
    stopWatchingPath();
  });
});
