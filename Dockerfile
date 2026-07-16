FROM node:20-slim

# ffmpeg + python3 (für yt-dlp) + yt-dlp-Binary
RUN apt-get update && apt-get install -y --no-install-recommends \
      ffmpeg python3 ca-certificates wget && \
    wget -q https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -O /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY server.js ./

ENV PORT=10000
EXPOSE 10000
CMD ["node", "server.js"]
