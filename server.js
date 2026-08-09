/* eslint-disable @typescript-eslint/no-require-imports */
const process = require('process');

process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT = process.env.PORT || '3000';
process.env.HOSTNAME = '0.0.0.0';

try {
  require('./.next/standalone/server.js');
} catch (err) {
  console.error('Standalone server entry missing, launching Next server:', err);
  const next = require('next');
  const { createServer } = require('http');
  const { parse } = require('url');

  const app = next({ dev: false, hostname: '0.0.0.0', port: 3000 });
  const handle = app.getRequestHandler();

  app.prepare().then(() => {
    createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    }).listen(3000, '0.0.0.0', () => {
      console.log('> Ready on http://0.0.0.0:3000');
    });
  });
}
