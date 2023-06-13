const videoPlayer = document.getElementById('player');
const videoUrlParams = new URLSearchParams(window.location.search);
const videoId = videoUrlParams.get('v');
const videoUrl = `/play?v=${videoId}`;

videoPlayer.src = videoUrl;