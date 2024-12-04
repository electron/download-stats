const requireDir = require('require-dir');
const data = requireDir('./data');

// Generates an array of years ranging from 2015 - present year.
const generateYearRange = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({
    length: currentYear - 2015 + 1
  }, (_, i) => 2015 + i);
};

let combined = Object.keys(data).reduce((acc, key) => {
  data[key].downloads.forEach(({ day, downloads }) => {
    acc[day] = (acc[day] || 0) + downloads;
  });
  return acc;
}, {});

combined = Object.entries(combined).sort((a, b) => {
  a[0].localeCompare(b[0])
});

const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const today = new Date().toISOString();
const results = [];

generateYearRange().forEach((year) => {
  months.forEach((month) => {
    const yearAndMonth = `${year}-${month}`;
    const downloadsInMonth = combined
      .filter((day) => day[0].startsWith(yearAndMonth))
      .map((day) => day[1])
      .reduce((sum, value) => sum + value, 0);

    // Account for this month, which is still in progress
    const daysInMonth = yearAndMonth === today.substring(0, 7) ? Number(today.substring(8, 2)) : 30;

    const average = Math.round(downloadsInMonth / daysInMonth);

    if (average > 0) {
      results.push([yearAndMonth, average]);
    }
  });
});

console.log('# Electron Download Stats\n');
console.log(
  '[![Update Download Stats](https://github.com/electron/download-stats/actions/workflows/schedule.yml/badge.svg)](https://github.com/electron/download-stats/actions/workflows/schedule.yml)\n',
);
console.log('## npm Downloads\n');
console.log(
  '> Average combined daily downloads by month for `electron`, `electron-prebuilt`, `electron-nightly`, and `electron-prebuilt-compile`.\n',
);
console.log('Month | Daily Downloads');
console.log('--- | ---');
results.forEach((result) => {
  console.log(result.join(' | '));
});
