workflow "Publish Master" {
  on = "push"
  resolves = ["GitHub Action for Slack"]
}

action "GitHub Action for npm" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  runs = "npm publish"
  secrets = ["NPM_AUTH_TOKEN"]
}

action "GitHub Action for Slack" {
  uses = "Ilshidur/action-slack@05af5d99e2384df24b581e2a137dfcbd167e69cb"
  needs = ["GitHub Action for npm"]
  secrets = ["SLACK_WEBHOOK"]
  args = "Published NPM Package."
}
