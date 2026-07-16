const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

const app = express();
app.use(express.json({ limit: '1mb' }));

// CORS: standardmäßig für alle Ursprünge; per ALLOWED_ORIGIN einschränkbar.
const ORIGIN = process.env.ALLOWED_ORIGIN || '*';
app.use(cors({ origin: ORIGIN, exposedHeaders: ['Content-Disposition'] }));

app.get('/health', (req, res) => res.json({ ok: true }));

function sanitize(name) {
  return (name || 'download').replace(/[^\w\-. ()]+/g, '_').slice(0, 120).trim() || 'download';
}

app.post('/api/download', async (req, res) => {
  const { url, format } = req.body || {};
  if (!url || !/^https?:\/\//i.test(url)) return res.status(400).json({ error: 'Ungültige URL' });
  const fmt = format === 'mp4' ? 'mp4' : 'mp3';

  const id = crypto.randomBytes(6).toString('hex');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dl-' + id + '-'));
  const outTmpl = path.join(dir, 'out.%(ext)s');
  const cleanup = () => { try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) {} };

  const args = fmt === 'mp3'
    ? ['-x', '--audio-format', 'mp3', '--audio-quality', '0', '--no-playlist', '-o', outTmpl, url]
    : ['-f', 'bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/b', '--merge-output-format', 'mp4', '--no-playlist', '-o', outTmpl, url];

  // Titel für den Dateinamen ermitteln (best effort)
  let title = 'download';
  try {
    title = await new Promise((resolve) => {
      let out = '';
      const p = spawn('yt-dlp', ['--no-playlist', '--print', 'title', url]);
      p.stdout.on('data', d => out += d);
      p.on('close', () => resolve(out.trim().split('\n')[0] || 'download'));
      p.on('error', () => resolve('download'));
    });
  } catch (e) {}

  const yt = spawn('yt-dlp', args);
  let errBuf = '';
  yt.stderr.on('data', d => { errBuf += d; });
  yt.on('error', e => { cleanup(); if (!res.headersSent) res.status(500).json({ error: 'yt-dlp nicht verfügbar: ' + e.message }); });
  yt.on('close', code => {
    if (code !== 0) { cleanup(); return res.status(500).json({ error: 'Download fehlgeschlagen', detail: errBuf.slice(-800) }); }
    const files = fs.readdirSync(dir).filter(f => f.startsWith('out.'));
    if (!files.length) { cleanup(); return res.status(500).json({ error: 'Keine Datei erzeugt', detail: errBuf.slice(-800) }); }
    const file = path.join(dir, files[0]);
    const ext = (path.extname(files[0]).slice(1) || fmt).toLowerCase();
    const fname = sanitize(title) + '.' + ext;
    res.setHeader('Content-Disposition', `attachment; filename="${fname}"`);
    res.setHeader('Content-Type', ext === 'mp3' ? 'audio/mpeg' : ext === 'mp4' ? 'video/mp4' : 'application/octet-stream');
    const stream = fs.createReadStream(file);
    stream.pipe(res);
    stream.on('close', cleanup);
    stream.on('error', () => { cleanup(); if (!res.headersSent) res.status(500).end(); });
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('d-asap-api läuft auf Port ' + PORT));
