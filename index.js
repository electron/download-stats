const requireDir = require('require-dir');
const lodash = require('lodash');
const data = requireDir('./data');

// Generates an array of years ranging from 2015 - present year.
const generateYearRange = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 2015; i <= currentYear; i++) {
    years.push(i);
  }
  return years;
};

let combined = {};

Object.keys(data).forEach((key) => {
  data[key].downloads.forEach((metric) => {
    const { day, downloads } = metric;
    if (!combined[day]) combined[day] = 0;
    combined[day] += downloads;
  });
});

combined = lodash.chain(combined).toPairs().sortBy(0).value();

const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const today = new Date().toISOString();
const results = [];

generateYearRange().forEach((year) => {
  months.forEach((month) => {
    const yearAndMonth = `${year}-${month}`;
    const downloadsInMonth = lodash
      .chain(combined)
      .filter((day) => day[0].startsWith(yearAndMonth))
      .map((day) => day[1])
      .sum()
      .value();

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
