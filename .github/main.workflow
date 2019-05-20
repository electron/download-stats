workflow "Update Download Stats" {
  resolves = ["Check latest statistics"]
  on = "schedule(30 20 * * *)"
}

action "Check latest statistics" {
  uses = "./"
  runs = "npm run release"
  secrets = ["GITHUB_TOKEN", "SNITCH_URL"]
}
