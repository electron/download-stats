const { Octokit } = require('@octokit/rest');
const { GITHUB_TOKEN } = process.env;

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

function generateData(page = 0, allReleases = []) {
  return octokit.rest.repos
    .listReleases({
      owner: 'electron',
      repo: 'electron',
      per_page: 100,
      page,
    })
    .then(({ data }) => {
      if (data.length === 0) return allReleases;
      allReleases.push(...data);
      return generateData(page + 1, allReleases);
    });
}

generateData().then((data) => {
  console.log(JSON.stringify(data, null, 2));
});
