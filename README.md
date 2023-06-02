# gdhi-app-version-2

[![GDHI-Frontend](https://github.com/healthenabled/gdhi-app-version2/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/healthenabled/gdhi-app-version2/actions/workflows/build.yml)

The App is build using Vue2, Vite and Vitest. It uses Yarn as a package manager and github actions for CI/CD.

## Pre-requisites

1. ### Install nvm

   Nvm allows you to quickly install and use different versions of node via the
   command line.

- `brew install nvm`
  or if you face any issues,

  1. Run the nvm installer
     In your terminal, run the nvm installer. For v0.391 the command looks like below. Please check nvm documentation for the latest version

  - `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash`
    #### or
  - `wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash`
    You can use curl or bash depending on the command available on your device.
    These commands will clone the nvm repository to a ~/.nvm directory on your device.

  2. Update your profile configuration
     The installation process from step 1 should also automatically add the nvm configuration to your profile. If you're using zsh, that would be ~/.zshrc. If you're using bash, that would be ~/.bash_profile...or some other profile.
     If it doesn't automatically add nvm configuration, you can add it yourself to your profile file:

  - `export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")" [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"`
    This command above loads nvm for use.

  3. Reload the shell configuration
     With your profile configuration updated, now you will reload the configuration for your terminal to use:

  - `source ~/.bashrc`
    With this command executed, nvm is ready for you to use. You can confirm that nvm is installed correctly by running:
  - `nvm -v`
    This should show the version of nvm installed.

2. ### Install yarn

   Before you start using Yarn, you'll first need to install it on your system. There are many different ways to install Yarn, but a single one is recommended and cross-platform:

   #### Install via npm

   It is recommended to install Yarn through the npm package manager, which comes bundled with Node.js when you install it on your system.
   Once you have npm installed you can run the following both to install and upgrade Yarn:

- `npm install --global yarn`
  To verify the installation,
- `yarn  -- version`

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

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
