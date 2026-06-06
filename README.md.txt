# UI Automation Playwright

A modern UI test automation framework built with Playwright and TypeScript, following scalable QA automation practices.

## Features

* Playwright + TypeScript
* Page Object Model (POM)
* Custom Fixtures
* Smoke Tests
* End-to-End (E2E) Tests
* Reusable Test Data
* Authentication State Management
* HTML Reports

## Project Structure

```text
tests/
├── smoke/
│   ├── public/
│   └── auth/
├── e2e/
├── pages/
├── fixtures/
├── data/
└── config/
```

## Installation

```bash
npm install
```

## Run All Tests

```bash
npx playwright test
```

## Run Smoke Tests

```bash
npx playwright test --project=smoke-auth
```

## Run E2E Tests

```bash
npx playwright test --project=e2e
```

## Technologies

* Playwright
* TypeScript
* Node.js

## Author

Mina Khodaei
