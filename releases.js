const unsorted = require('./releases.json');
const semver = require('semver');

function formatNumber(num) {
  return num.toLocaleString('en-US');
}

function getTotalDownloads(release) {
  return release.assets.reduce((sum, asset) => sum + asset.download_count, 0);
}

const sorted = unsorted.sort((r1, r2) => {
  return semver.lte(r1.tag_name, r2.tag_name) ? 1 : -1;
});

const seenMajors = new Set();
const releases = sorted.filter((release) => {
  const version = semver.parse(release.tag_name);
  if (!version) return false;
  if (seenMajors.has(version.major)) return false;

  seenMajors.add(version.major);
  return seenMajors.size <= 4;
});

console.log('\n\n## Asset Downloads\n');
console.log('> Download counts for the latest release in each supported version.\n');

// Only show main distributable files (electron zips for each platform)
// Include SHASUMS and main electron platform zips and exclude symbols/debug/etc.
function isMainAsset(name) {
  //
  if (name === 'SHASUMS256.txt') return true;
  if (!name.startsWith('electron-')) return false;
  if (!name.endsWith('.zip')) return false;

  const excludePatterns = ['-symbols.zip', '-debug.zip', '-dsym', '-pdb.zip', '-toolchain-'];
  return !excludePatterns.some((pattern) => name.includes(pattern));
}

releases.forEach((release) => {
  const totalDownloads = getTotalDownloads(release);
  const mainAssets = release.assets.filter((a) => isMainAsset(a.name));

  console.log(`\n### ${release.tag_name}\n`);
  console.log(
    `<details><summary>Download Data (${formatNumber(totalDownloads)} total downloads)</summary>\n`,
  );

  console.log('| File | Downloads |');
  console.log('| :--- | ---: |');
  mainAssets
    .sort((a, b) => b.download_count - a.download_count)
    .forEach((asset) => {
      console.log(`| \`${asset.name}\` | ${formatNumber(asset.download_count)} |`);
    });

  console.log('\n</details>');
});
