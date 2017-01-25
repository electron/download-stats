const releases = require('./releases.json')

console.log('\n\n## Asset Downloads\n')
console.log('> Raw download counts for every released GitHub asset.\n')

releases.forEach(release => {
  console.log(`\n### ${release.tag_name}\n`)

  console.log('File | Downloads')
  console.log('--- | ---')
  release.assets
    .sort((a, b) => b.download_count - a.download_count)
    .forEach(asset => {
      console.log(`${asset.name} | ${asset.download_count}`)
    })
})
