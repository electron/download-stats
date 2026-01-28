const requireDir = require('require-dir');
const { fetchStatistics, fetchReleases } = require('./fetch-data');

const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

const generateYearRange = () => {
  const currentYear = new Date().getFullYear();
  return Array.from(
    {
      length: currentYear - 2015 + 1,
    },
    (_, i) => 2015 + i,
  );
};

function calculateStatistics() {
  const data = requireDir('./data');

  let combined = Object.keys(data).reduce((acc, key) => {
    data[key].downloads.forEach(({ day, downloads }) => {
      acc[day] = (acc[day] || 0) + downloads;
    });
    return acc;
  }, {});

  combined = Object.entries(combined).sort((a, b) => {
    a[0].localeCompare(b[0]);
  });

  const today = new Date().toISOString();
  const results = [];

  generateYearRange().forEach((year) => {
    months.forEach((month) => {
      const yearAndMonth = `${year}-${month}`;
      const downloadsInMonth = combined
        .filter((day) => day[0].startsWith(yearAndMonth))
        .map((day) => day[1])
        .reduce((sum, value) => sum + value, 0);

      const daysInMonth =
        yearAndMonth === today.substring(0, 7) ? Number(today.substring(8, 2)) : 30;
      const average = Math.round(downloadsInMonth / daysInMonth);

      if (average > 0) {
        results.push([yearAndMonth, average]);
      }
    });
  });

  return results.slice(-24);
}

function formatNumber(num) {
  return num.toLocaleString('en-US');
}

function writeToReadme(results) {
  console.log('# Electron Download Stats\n');
  console.log(
    '[![Update Download Stats](https://github.com/electron/download-stats/actions/workflows/schedule.yml/badge.svg)](https://github.com/electron/download-stats/actions/workflows/schedule.yml)\n',
  );
  console.log('## npm Downloads\n');
  console.log(
    '> Average combined daily downloads by month for `electron`, `electron-prebuilt`, `electron-nightly`, and `electron-prebuilt-compile`.\n',
  );
  console.log('| Month | Daily Downloads |');
  console.log('| :---: | ---: |');
  results.forEach(([month, downloads]) => {
    console.log(`| ${month} | ${formatNumber(downloads)} |`);
  });
}

async function updateStatistics() {
  if (!process.env.GITHUB_TOKEN) {
    console.error('GITHUB_TOKEN is not set - cannot fetch release data');
    process.exit(1);
  }

  await fetchStatistics();
  await fetchReleases();

  const results = calculateStatistics();
  writeToReadme(results);
}

updateStatistics();
