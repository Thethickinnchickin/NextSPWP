const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Middleware to set the X-Frame-Options header
  server.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'ALLOW-FROM *'); // Replace with your domain
    next();
  });


  // Handle Next.js pages
  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
