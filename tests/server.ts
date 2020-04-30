import { createServer } from '../src/server';
import fetch from 'node-fetch';
import { setup, stopWatchingPath } from '../src/config';
import { resolve } from 'path';

setup(resolve(__dirname, 'config'));

describe('test server', () => {
  let _server: any;
  const json = (r: any) => r.json();
  const b = 'http://localhost:5000';
  const f = (method: any) => (u: any) => fetch(b + u, { method }).then(json);
  const get = f('get');
  const post = f('post');

  it('init', () => {
    const { server } = createServer({ port: 5000 });
    _server = server;
  });

  it('test', async (done) => {
    let res;
    res = await get('');
    expect(res).toEqual({ error: '404' });

    res = await post('/app/example_1/hello-world');
    expect(res.msg).toEqual('hah');

    res = await get('/app/example_1/hello-world');
    expect(res).toEqual({ error: '404' });

    res = await get('/app/example_1/some/111');
    expect(res).toEqual({ error: '404' });

    res = await get('/app/example_1/someSome');
    expect(res).toEqual({ error: '404' });
    done();
  });

  it('after all', () => {
    _server.close();
    stopWatchingPath();
  });
});
