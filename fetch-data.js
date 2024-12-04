const fs = require('fs');
const path = require('path');
const { Octokit } = require('@octokit/rest');
const { GITHUB_TOKEN } = process.env;

const packages = ['electron', 'electron-prebuilt', 'electron-nightly', 'electron-prebuilt-compile'];

async function fetchReleases() {
  const outputPath = path.join(__dirname, 'releases.json');
  const octokit = new Octokit({ auth: GITHUB_TOKEN });

  let page = 0;
  const allReleases = [];

  while (true) {
    const { data } = await octokit.rest.repos.listReleases({
      owner: 'electron',
      repo: 'electron',
      per_page: 100,
      page,
    });

    if (data.length === 0) break;

    allReleases.push(...data);
    page++;
  }

  fs.writeFileSync(outputPath, JSON.stringify(allReleases, null, 2), 'utf8');
}

async function fetchStatistics(pkgs = packages) {
  const nextYear = `${new Date().getFullYear() + 1}-01-01`;

  if (!Array.isArray(pkgs)) {
    console.error('Packages must be an array');
    process.exit(1);
  }

  for (const package of pkgs) {
    const url = `https://api.npmjs.org/downloads/range/2016-07-26:${nextYear}/${package}`;
    const outputPath = path.join(__dirname, 'data', `${package}.json`);

    try {
      const rawData = await fetch(url);
      const data = await rawData.json();
      fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`${package} download statistics written to ${outputPath}`);
    } catch (e) {
      console.error('Error fetching data:', error);
      process.exit(1);
    }
  }
}

module.exports = {
  fetchStatistics,
  fetchReleases,
};
