# gdhi-app-version-2

[![GDHI-Frontend](https://github.com/healthenabled/gdhi-app-version2/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/healthenabled/gdhi-app-version2/actions/workflows/build.yml)

The App is build using `Vue2`, `Vite` and `Vitest`.
It uses `Yarn@2` as a package manager and `github actions` for CI/CD.

## Table of Contents

**1. [Pre-requisites](#pre-requisites)**

## Pre-requisites

- ### Install nvm

  `nvm` allows you to quickly install and use different versions of `node` via the
  command line.

  1.  In your terminal, run the nvm installer.
      For `v0.391` the command looks like below. Please check `nvm` documentation for the latest version:

      - `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash`
        #### or
      - `wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash`
        <br/>You can use `curl` or `wget` depending on the command available on your device.
        These commands will clone the nvm repository to a ~/.nvm directory on your device.

  2.  Update your profile configuration
      The installation process from step 1 should also automatically add the nvm configuration to your profile.
      If it doesn't automatically add `nvm` configuration, you can add it yourself to your profile file:

      - `export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")" [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"`
        This command above loads nvm for use.

  3.  Reload the shell configuration
      With your profile configuration updated, now you will reload the configuration for your terminal to use:

      - `source ~/.bashrc`
        With this command executed, nvm is ready for you to use. You can confirm that nvm is installed correctly by running:
      - `nvm -v`
        This should show the version of nvm installed.

- ### Install `yarn`

  #### Install via `npm`

  It is recommended to install `yarn` through the `npm` package manager, which comes bundled with `Node`.
  Once you have npm installed you can run the following both to install and upgrade `Yarn`:

  ```sh
  npm install --global yarn
  ```

  <br/> To verify the installation:

  ```sh
  yarn  --version
  ```

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

### Install and setup nvm using [the link](https://github.com/nvm-sh/nvm#installing-and-updating)

The project uses Node v16 and YarnV2 as package manager.

Environment variables:

`VITE_IS_GOOGLE_ANALYTICS_ENABLED=true or false`

`VITE_GOOGLE_ANALYTICS_ID={google analytics gid}`

For running locally, we want to keep the Enabled flag as False

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
