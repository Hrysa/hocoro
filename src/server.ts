import Koa from 'koa';
import { getConfig, hasScope } from './config';
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

  const [, , scope, ...pathList] = path.split('/'),
    logO = { method, path, query, body, rawBody, headers, scope };

  if (!hasScope(scope)) return write(ctx, { error: 'scope not found' }, logO);

  const config = getConfig(scope, pathList);

  if (!config) return write(ctx, { error: 'api not found' }, logO);

  if (config[method]) {
    return write(ctx, config[method].res, logO);
  }

  write(ctx, { error: 'unsupported http method for this api' }, logO);
});

router.get('/log/:scope', (ctx) => {
  ctx.body = logs[ctx.params.scope] || 'no logs found';
});

router.all('*', (ctx) => {
  ctx.body = { error: 'unknown operate' };
});

function write(ctx: any, s: any, logO?: any) {
  ctx.body = s;
  logO.res = s;
  const { scope } = logO;
  if (!logs[scope]) logs[scope] = '';
  logO = stringifyYML(logO);
  if (logO) logs[scope] = log(`Income\n${logO}\n`, 'INFO') + logs[scope];
}
