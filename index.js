const express = require('express');
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');

const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/search', (req, res) => {
  const query = req.query.q;
  const page = req.query.page || 1;

  const options = { limit: 40, pages: page };

  ytsr(query, options)
    .then(results => {
      const videos = results.items
        .filter(item => item.type === 'video')
        .map(item => ({
          id: item.id,
          title: item.title,
          thumbnail: item.bestThumbnail.url,
          author: item.author.name
        }));
      res.json({ items: videos });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while searching for videos' });
    });
});

app.get('/play', (req, res) => {
  const videoId = req.query.v;
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

  ytdl(videoUrl, {
    format: 'mp4',
    quality: 'highest',
  }).pipe(res);
});


app.listen(port, () => {
  console.log(`NodeTube is listening on port ${port}`);
});
