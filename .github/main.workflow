workflow "build and test" {
  on = "push"
  resolves = [
    "test",
    "build",
  ]
}

action "build" {
  uses = "actions/npm@master"
  args = "install"
}

action "test" {
  needs = "build"
  uses = "actions/npm@master"
  args = "test"
}

workflow "publish on release" {
  on = "release"
  resolves = ["publish"]
}

action "publish" {
  uses = "actions/npm@master"
  args = "publish"
  secrets = ["NPM_AUTH_TOKEN"]
}
