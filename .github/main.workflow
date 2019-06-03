workflow "Update Download Stats" {
  resolves = ["Check latest statistics"]
  on = "schedule(30 20 * * *)"
}

action "Check latest statistics" {
  uses = "./"
  secrets = ["GITHUB_TOKEN"]
}
