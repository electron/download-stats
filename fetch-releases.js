const fetch = require('node-fetch');

const releaseUrl = 'https://api.github.com/repos/electron/electron/releases';

function fetchPage(n = 0, allReleases = []) {
  return fetch(`${releaseUrl}?per_page=100&page=${n}`)
    .then((r) => r.json())
    .then((releases) => {
      if (releases.length === 0) return allReleases;
      allReleases.push(...releases);
      return fetchPage(n + 1, allReleases);
    });
}

fetchPage().then((releases) => console.log(JSON.stringify(releases, null, 2)));
