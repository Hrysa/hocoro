import { createServer } from '../src/server';
import fetch from 'node-fetch';
import { setup, stopWatchingPath } from '../src/config';
import { resolve } from 'path';
import { writeFileSync, unlinkSync } from 'fs';

describe('test server', () => {
  let _server: any;
  const json = (r: any) => r.json(),
    text = (r: any) => r.text(),
    b = 'http://localhost:5000',
    f = (method: any) => async (u: any, o: any = {}, f: any = json) =>
      fetch(b + u, { method, ...o }).then(f),
    get = f('get'),
    post = f('post');

  it('init', () => {
    setup(resolve(__dirname, 'config'));
    const { server } = createServer({ port: 5000 });
    _server = server;
  });

  it('test', async (done) => {
    const tmpFile = resolve(__dirname, 'config', 'tmp.yml');

    writeFileSync(tmpFile, 'hello: 1');

    unlinkSync(tmpFile);

    let res: any;

    res = await get('/log/test-1', void 0, text);
    expect(res).toEqual('no logs found');

    res = await get('');
    expect(res).toEqual({ error: 'unknown operate' });

    res = await post('/app/test-1/hello-world');
    expect(res.msg).toEqual('hah');

    res = await get('/app/test-1/hello-world');
    expect(res).toEqual({ error: 'unsupported http method for this api' });

    res = await get('/app/test-1/some/111');
    expect(res).toEqual({ error: 'unsupported http method for this api' });

    res = await get('/app/test-1/someSome');
    expect(res).toEqual({ error: 'api not found' });

    res = await post(
      '/app/test-1/some/111',
      {
        body: '{aaa',
        headers: { 'Content-Type': 'application/json' },
      },
      text,
    );
    console.log(res);

    res = await await post('/log/test-1', void 0, text);
    console.log(typeof res);
    expect(res.length > 0).toEqual(true);

    done();
  });

  it('after all', () => {
    _server.close();
    stopWatchingPath();
  });
});
