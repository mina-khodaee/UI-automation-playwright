# UI Automation Playwright

A modern UI test automation framework built with Playwright and TypeScript, following scalable and maintainable QA automation practices.

## Features

* Playwright + TypeScript
* Page Object Model (POM)
* Custom Fixtures
* Smoke Testing
* End-to-End (E2E) Testing
* Reusable Test Data
* Authentication State Management
* HTML Reporting
* Scalable Test Architecture

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

## Architecture Highlights

* Separation of Smoke and E2E test suites
* Page Object Model for maintainability
* Shared fixtures for reusable setup
* Authentication state reuse for faster execution
* Organized test data management

Note: CI runs may fail because tests depend on a local environment (localhost server).

## Author

Mina Khodaei
