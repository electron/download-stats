const unsorted = require('./releases.json').slice(0, 30);
const semver = require('semver');

console.log('\n\n## Asset Downloads\n');
console.log('> Raw download counts for every released GitHub asset.\n');

const releases = unsorted.sort((r1, r2) => {
  return semver.lte(r1.tag_name, r2.tag_name) ? 1 : -1;
});

releases.forEach((release) => {
  console.log(`\n### ${release.tag_name}\n`);

  console.log('<details><summary>Download Data</summary>\n');

  console.log('File | Downloads');
  console.log('--- | ---');
  release.assets
    .sort((a, b) => b.download_count - a.download_count)
    .forEach((asset) => {
      console.log(`${asset.name} | ${asset.download_count}`);
    });

  console.log('\n</details>');
});
