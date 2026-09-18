import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('dist');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon'};
http.createServer(async (req,res) => {
  try {
    let pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if (pathname.endsWith('/')) pathname += 'index.html';
    const file = path.resolve(root, '.' + pathname);
    if (!file.startsWith(root + path.sep)) throw new Error('Invalid path');
    const body = await readFile(file);
    res.writeHead(200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-cache'});
    res.end(body);
  } catch { res.writeHead(404, {'Content-Type':'text/html'});res.end('<h1>Page not found</h1><a href="/">Return to Yemisi Soneye</a>'); }
}).listen(4173,'127.0.0.1',()=>console.log('Portfolio ready: http://127.0.0.1:4173'));
