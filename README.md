# gdhi-app-version-2

[![GDHI-Frontend](https://github.com/healthenabled/gdhi-app-version2/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/healthenabled/gdhi-app-version2/actions/workflows/build.yml)

The App is build using `Vue2`, `Vite` and `Vitest`.
It uses `Yarn@2` as a package manager and `github actions` for CI/CD.

## Table of Contents

1. **[Pre-requisites](#pre-requisites)**
2. **[Build Dependencies](#build-dependencies)**

## Pre-requisites

- ### Install nvm

  `nvm` allows you to quickly install and use different versions of `node` via the
  command line.

  1.  In your terminal, run the nvm installer.
      For `v0.391` the command looks like below. Please check `nvm` documentation for the latest version:

      ```sh
      curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
      ```

      #### or

      ```sh
        wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
      ```

      You can use `curl` or `wget` depending on the command available on your device.
      These commands will clone the nvm repository to a `~/.nvm` directory on your device.

  2.  Update your profile configuration:<br/>
      The installation process from step 1 should also automatically add the `nvm` configuration to your profile.
      If it doesn't automatically add `nvm` configuration, you can add it yourself to your profile file:

      ```sh
         export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")" [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
      ```

      This command above loads nvm for use.

  3.  Reload the shell configuration
      With your profile configuration updated, now you will reload the configuration for your terminal to use:

      ```sh
        source ~/.bashrc`
      ```

      With this command executed, nvm is ready for you to use. You can confirm that nvm is installed correctly by running:

      ```sh
        nvm -v
      ```

      This should show the version of `nvm` installed.

  4.  Use the specified node version in the repository

      ```sh
        nvm use
      ```

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
  We are using `yarn` version 3.X in our project.

## Build Dependencies:
- [Vue2](https://v2.vuejs.org/) as FE framework of choice.
- [axios](https://github.com/axios/axios/) for API calls.
- [chartjs](https://www.chartjs.org/) chart utils.
- [leaflet](https://leafletjs.com/reference.html) for displaying Maps.
- [papaparse](https://www.papaparse.com/docs) and [yup](https://github.com/jquense/yup) for csv pasrsing and validations.
- [pdf-lib](https://github.com/Hopding/pdf-lib) for Browser pdf genration.
- [vue-gtag](https://github.com/MatteoGabriele/vue-gtag/tree/1.0) for Google analytics integration. This depends on the following env variables:<br/> 
  `VITE_IS_GOOGLE_ANALYTICS_ENABLED=true or false`
  `VITE_GOOGLE_ANALYTICS_ID={google analytics gid}`


For running locally, we want to keep the Enabled flag as False

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
