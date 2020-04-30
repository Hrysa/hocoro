import Koa from 'koa';
import { getConfig } from './config';
import Router from '@koa/router';
import { log } from './util';
import { stringifyYML } from './util';
import bodyParser from 'koa-bodyparser';

export function createServer({ port }: { port: number }) {
  const app = new Koa();

  app.use(async (ctx, next) => {
    try {
      await bodyParser()(ctx, next);
    } catch (e) {
      log('json format failed', 'WARN');
      await next();
    }
  });
  app.use(router.routes());

  const server = app.listen(port);

  return { app, server };
}

const router = new Router();
const logs: any = {};

router.all('/app/*', async (ctx) => {
  const {
      headers,
      path,
      query,
      request: { body, rawBody },
    } = ctx,
    method = ctx.method.toLocaleLowerCase();

  const [, , scope, ...pathList] = path.split('/');
  const config = getConfig(scope, pathList);

  if (!config) return write(ctx, { error: '404' });

  if (!logs[scope]) logs[scope] = '';

  const info = stringifyYML({ method, path, query, body, rawBody, headers });
  logs[scope] = log(`Income\n${info}\n`, 'INFO') + logs[scope];

  if (config[method]) {
    return write(ctx, config[method].res);
  }

  write(ctx, { error: '404' });
});

router.get('/log/:scope', (ctx) => {
  ctx.body = logs[ctx.params.scope] || 'no logs found';
});

router.all('*', (ctx) => {
  ctx.body = { error: '404' };
});

function write(ctx: any, s: any) {
  ctx.body = s;
}
