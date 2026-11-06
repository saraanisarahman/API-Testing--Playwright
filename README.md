# Restful Booker API tests

API tests for [Restful Booker](https://restful-booker.herokuapp.com/) using Playwright Test.

## Requirements

- Node.js 18 or newer
- npm

## Install

```powershell
npm install
```

## Run the API tests

```powershell
npm run test:api
```

The suite checks the health endpoint and exercises the booking create/read/update/delete flow. It only deletes the booking created by that test.

The demo API credentials are used by default. To override them in PowerShell:

```powershell
$env:RESTFUL_BOOKER_USERNAME = "your-username"
$env:RESTFUL_BOOKER_PASSWORD = "your-password"
npm run test:api
```

Playwright's request API does not require installing browser binaries.
