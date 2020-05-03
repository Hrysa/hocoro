import Koa from 'koa';
import { getConfig, hasScope } from './config';
import Router from '@koa/router';
import { log } from './util';
import { stringifyYML } from './util';
import bodyParser from 'koa-bodyparser';
import miua from 'miua';

export function createServer({ port }: { port: number }) {
  const app = new Koa();

  app.use(async (ctx, next) => {
    try {
      await bodyParser()(ctx, next);
    } catch (e) {
      log('json format failed: ' + e, 'WARN');
    }
  });

  // app.use(bodyParser());
  app.use(router.routes());

  const server = app.listen(port);

  return { app, server };
}

const router = new Router();
const logs: any = {};

router.all('/app/*', async (ctx) => {
  const { headers, path, query, request } = ctx,
    { body, rawBody } = request,
    method = ctx.method.toLocaleLowerCase();

  const [, , scope, ...pathList] = path.split('/'),
    logO = { method, path, query, body, rawBody, headers, scope };

  if (!hasScope(scope)) return write(ctx, { error: 'scope not found' }, logO);

  const { config, variables } = getConfig(scope, pathList);

  if (!config) return write(ctx, { error: 'api not found' }, logO);

  const api = config[method] || config.all;

  if (!api)
    return write(ctx, { error: 'unsupported http method for this api' }, logO);

  if (!api.res) return write(ctx, null);

  const len = Number(api.len) || '';
  const { res } = miua.gen({ ['res|' + len]: api.res }, { variables });

  return write(ctx, len ? res : res.pop(), logO);
});

router.get('/log/:scope', (ctx) => {
  ctx.body = logs[ctx.params.scope] || 'no logs found';
});

router.all('*', (ctx) => {
  ctx.body = { error: 'unknown operate' };
});

function write(ctx: any, s: any, logO: any = {}) {
  ctx.body = s;
  logO.res = s;
  const { scope } = logO;
  if (!logs[scope]) logs[scope] = '';
  logO = stringifyYML(logO);
  if (logO) logs[scope] = log(`Income\n${logO}\n`, 'INFO') + logs[scope];
}
