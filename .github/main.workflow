workflow "Update Download Stats" {
  resolves = ["Check latest statistics"]
  on = "schedule(30 20 * * *)"
}

action "Check latest statistics" {
  uses = "./"
  # custom token needed to enable committing as electron-bot
  secrets = ["GH_TOKEN"]
}
