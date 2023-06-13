const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const videoGrid = document.getElementById('videoGrid');
let currentPage = 1;

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const query = searchInput.value;

  fetch(`/search?q=${encodeURIComponent(query)}&page=${currentPage}`)
    .then((response) => response.text())
    .then((text) => {
      console.log('Response:', text);
      const videos = JSON.parse(text);
      displayVideos(videos);
    })
    .catch((error) => {
      console.error('Error occurred during search:', error);
    });
});

function displayVideos(response) {
  videoGrid.innerHTML = '';

  if (!response.items || !Array.isArray(response.items)) {
    console.error('Invalid response format. Expected "items" array.');
    return;
  }

  const videos = response.items;

  if (videos.length === 0) {
    const noResultsMessage = document.createElement('p');
    noResultsMessage.textContent = 'No videos found.';
    videoGrid.appendChild(noResultsMessage);
    return;
  }

  videos.forEach((video) => {
    const videoLink = document.createElement('a');
    videoLink.href = `video.html?v=${video.id}`;

    const thumbnail = document.createElement('img');
    thumbnail.src = video.thumbnail;
    thumbnail.alt = `${video.title} thumbnail`;

    const title = document.createElement('h2');
    title.textContent = video.title;

    const author = document.createElement('p');
    author.textContent = `by ${video.author}`;

    const videoDiv = document.createElement('div');
    videoDiv.classList.add('video');
    videoDiv.appendChild(thumbnail);
    videoDiv.appendChild(title);
    videoDiv.appendChild(author);

    videoLink.appendChild(videoDiv);
    videoGrid.appendChild(videoLink);
  });

  addPagination(response.pages);
}

function addPagination(totalPages) {
  const paginationContainer = document.createElement('div');
  paginationContainer.classList.add('pagination');

  for (let i = 1; i <= totalPages; i++) {
    const pageLink = document.createElement('a');
    pageLink.href = '#';
    pageLink.textContent = i;
    pageLink.addEventListener('click', () => {
      currentPage = i;
      searchForm.dispatchEvent(new Event('submit'));
    });

    if (i === currentPage) {
      pageLink.classList.add('active');
    }

    paginationContainer.appendChild(pageLink);
  }

  videoGrid.appendChild(paginationContainer);
}
