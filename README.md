# d·asap API (Downloader-Backend)

Kleiner Web-Service mit `yt-dlp` + `ffmpeg`, den der Downloader-Tab der Seite anspricht.

## Endpunkte
- `GET /health` → `{ ok: true }`
- `POST /api/download` · Body `{ "url": "https://…", "format": "mp3" | "mp4" }`
  → liefert die Datei zurück (Content-Disposition mit Dateiname).

## Auf Render deployen (als eigener Web-Service)

1. Render-Dashboard → **New** → **Web Service**.
2. Repo `d-asap` verbinden.
3. **Root Directory:** `server`
4. **Runtime/Environment:** *Docker* (wird durch die `Dockerfile` automatisch erkannt).
5. **Instance Type:** Free reicht zum Testen.
6. (Optional, empfohlen) Environment Variable **ALLOWED_ORIGIN** = deine Frontend-URL,
   z. B. `https://d-asap-tools.onrender.com` — dann darf nur deine Seite das Backend nutzen.
7. **Create Web Service** → nach dem Build läuft es unter `https://<name>.onrender.com`.

Diese Backend-URL trägst du **einmal im Downloader-Tab** der Seite ins Feld „Backend-URL" ein.

## Wichtig / Grenzen
- **YouTube blockt Cloud-IPs** zunehmend. Läuft der Download in „Sign in to confirm you're
  not a bot", hilft oft nur: yt-dlp aktuell halten (bei jedem Deploy wird die neueste Version
  gezogen) oder Cookies mitgeben (dann sag Bescheid, dann erweitern wir das).
- **Free-Tier** schläft nach ~15 Min Inaktivität ein → erster Request dauert bis ~1 Min (Aufwachen).
- Downloads von urheberrechtlich geschütztem Material und YouTubes ToS liegen in deiner Verantwortung.
