# d·asap tools

Lokale Datei-Tools für Video- und Bild-Workflows — läuft komplett im Browser.

- **Renamer** — benennt Clips einheitlich um (direkt im Ordner via Chrome/Edge, sonst als Download).
- **Resizer** — bringt Bilder & Videos auf Social-Maße (1:1, 9:16, 4:5, 16:9 …) mit Smart-Fokus-Zuschnitt.
- **Converter** — wandelt Formate um (PNG↔JPG, MP4→MP3 u. a.).
- **Key & BPM** — erkennt Tempo und Tonart eines Songs (Chromagramm + Krumhansl-Profile), inkl. Camelot-Code — als Startwert für Antares Auto-Tune.
- **Theme-Picker** — 7 Farbwelten, Wechsel mit weichem Farbwisch.

Bilder werden lokal per Canvas verarbeitet. Für Video/Audio lädt einmalig die
`ffmpeg.wasm`-Engine aus dem Netz (~30 MB) — funktioniert nur, wenn die Seite
online per HTTPS läuft (z. B. Render). Der Smart-Zuschnitt nutzt `smartcrop.js` vom CDN.

## Struktur

```
index.html      # die ganze App (eine Datei, keine Build-Tools)
render.yaml     # Render-Blueprint (statische Seite)
```

## Auf Render deployen

**Variante A — mit Blueprint (empfohlen):**
1. Repo zu GitHub pushen (siehe unten).
2. Auf https://dashboard.render.com → **New** → **Blueprint**.
3. Das GitHub-Repo `d-asap` auswählen. Render liest `render.yaml` und legt die statische Seite an.
4. **Apply** → nach ~1 Min ist die Seite unter `https://<name>.onrender.com` live.

**Variante B — ohne Blueprint:**
1. Render-Dashboard → **New** → **Static Site**.
2. Repo `d-asap` verbinden.
3. **Build Command:** leer lassen · **Publish Directory:** `.`
4. **Create Static Site**.

Static Sites auf Render sind kostenlos und schlafen nicht ein.
