const requireDir = require('require-dir')
const lodash = require('lodash')
const data = requireDir('./data')
const today = new Date().toISOString()
const years = [2015,2016,2017,2018]
const months = ['01','02','03','04','05','06','07','08','09','10','11','12']
const results = []
let combined = {}

Object.keys(data).forEach(key => {
  data[key].downloads.forEach(metric => {
    const {day, downloads} = metric
    if (!combined[day]) combined[day] = 0
    combined[day] += downloads
  })
})

combined = lodash.chain(combined)
  .toPairs()
  .sortBy(0)
  .value()


years.forEach(year => {
  months.forEach(month => {
    const yearAndMonth = `${year}-${month}`
    const downloadsInMonth = lodash.chain(combined)
      .filter(day => day[0].startsWith(yearAndMonth))
      .map(day => day[1])
      .sum()
      .value()

    // Account for this month, which is still in progress
    const daysInMonth = (yearAndMonth === today.substr(0, 7))
      ? Number(today.substr(8, 2))
      : 30

    let average = Math.round(downloadsInMonth/daysInMonth)

    if (average > 0) {
      results.push([yearAndMonth, average])
    }
  })
})

console.log('# Electron Download Stats\n')

console.log('## npm Downloads\n')
console.log('> Average combined daily downloads by month for `electron`, `electron-prebuilt`, and `electron-prebuilt-compile`.\n')
console.log('Month | Daily Downloads')
console.log('--- | ---')
results.forEach(result => {
  console.log(result.join(' | '))
})
