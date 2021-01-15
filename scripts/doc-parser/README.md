# Ant design doc parser
> this script parses desiered documents, and code snippets from github repository, and the ant-d official website.




## How to use

1. you'll need your own private github access token in order to use this scritps.

- get your token, from [here](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token).
- create .env file
- add `GITHUB_ACCESS_TOKEN=<your-token>`

2. install ts-node or other ts executable that you prefer

```sh
ts-node index.ts
```

3. desired oputput of ant design manifest will be logged.