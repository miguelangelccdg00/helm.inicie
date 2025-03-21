import { renderModule } from '@angular/platform-server';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'fs';
import { AppServerModule } from './app/app.server.module';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = readFileSync(resolve(browserDistFolder, 'index.html'), 'utf-8');

const app = express();

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.get('*', (req, res) => {
  const url = req.originalUrl;
  
  // Server-side rendering
  renderModule(AppServerModule, {
    document: indexHtml,
    url: url
  }).then(html => {
    res.status(200).send(html);
  }).catch(err => {
    console.error('Error rendering app:', err);
    res.status(500).send('Server error');
  });
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export default app;