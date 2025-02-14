# EmbassyOS Frontend

EmbassyOS has three user interfaces and a shared library, all written in Ionic/Angular/Typescript using an Angular workspace environment:

1. **ui**: the main user interface
1. **setup-wizard**: used to facilitate initial setup
1. **diagnostic-ui**: used to display certain diagnostic information in the event EmbassyOS fails to initialize
1. **shared**: contains components, types, and functions shared amongst the three UIs.

## Development Environment Setup

- Requirements:
  - [Install nodejs](https://nodejs.org/en/)
  - [Install npm](https://www.npmjs.com/get-npm)

Check your versions

```
node --version
v16.10.0

npm --version
v8.0.0
```

## Running locally with mocks

1. Clone the repository

```
git clone https://github.com/Start9Labs/embassy-os.git
cd embassy-os
git submodule update --init --recursive
cd frontend
npm ci
npm run build:deps
```

2. Copy `config-sample.json` and its contents to a new file `config.json`.

```
cp config-sample.json config.json
```

By default, "useMocks" is set to `true`.
Valid values for "maskAs" are `tor` and `lan`.

3. Start the development server(s)

```
npm run start:ui
npm run start:setup-wizard
npm run start:diagnostic-ui
```

## Running locally with proxied backend

This section enables you to run a local frontend with a remote backend (eg. hosted on a live Embassy). It assumes you have completed Step 1 and Step 2 in the [section above](#running-locally-with-mocks)

1. Set `useMocks: true` in `config.json`

2. Create a proxy configuration file from the sample:

```
cp proxy.conf.json.sample proxy.conf.json
```

3. Change the target address to desired IP address in `proxy.conf.json`

4. Start the development server

```
npm run start:ui:proxy
```
