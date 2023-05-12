# gdhi-app-version-2

[![GDHI-Frontend](https://github.com/healthenabled/gdhi-app-version2/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/healthenabled/gdhi-app-version2/actions/workflows/build.yml)

The App is build using Vue2, Vite and Vitest. It uses Yarn as a package manager and github actions for CI/CD.

## Pre-requisites

- `brew install nvm`
- `brew install yarn`

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

### Install and setup nvm using [the link](https://github.com/nvm-sh/nvm#installing-and-updating)

The project uses Node v16 and YarnV2 as package manager
Environment variables:
`VITE_IS_GOOGLE_ANALYTICS_ENABLED=true or false`

`VITE_GOOGLE_ANALYTICS_ID={analytics gid}`
```sh
nvm use
```

### Then use the below to install the deps

```sh
yarn install
```

### Compile and Hot-Reload for Development

```sh
yarn dev
```

### Compile and Minify for Production

```sh
yarn build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
yarn test
```

### Lint with [ESLint](https://eslint.org/)

```sh
yarn lint
```
