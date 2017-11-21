[![Build Status](https://travis-ci.org/BrunoBernardino/personal-github-zapier.svg?branch=master)](https://travis-ci.org/BrunoBernardino/personal-github-zapier)

# Personal Github for Zapier

THIS IS NOT OFFICIALLY ENDORSED BY ZAPIER, I JUST MADE THIS FOR MYSELF AND AM RELEASING FOR ANYONE TO USE.

This is a simple app I built for myself, to help me get a list of PRs still open and closed in the current week.

It uses Github's GraphQL API.

You're welcome to [try it out](https://zapier.com/platform/public-invite/1663/04e64e2a900f1ee2ec9860fa710d4d53/).

### Development

[Create a token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/) (you need `repo` and `user` scopes) and add it to a new (or existing) `.environment` file:

```
USERNAME=your_github_username
TOKEN=your_personal_access_token
```
