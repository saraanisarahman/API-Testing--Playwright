# Restful-Booker API Test Suite (Playwright + JavaScript)

[![API Tests](https://github.com/saraanisarahman/API-Testing--Playwright/actions/workflows/api-tests.yml/badge.svg)](https://github.com/saraanisarahman/API-Testing--Playwright/actions/workflows/api-tests.yml)

Automated API tests for the [Restful-Booker](https://restful-booker.herokuapp.com/apidoc/index.html) hotel booking API, written with Playwright's `request` API. The suite covers the full booking CRUD flow, token-based authentication, and negative scenarios, and runs automatically in GitHub Actions on every push.

## Highlights

- **14 API tests**: 6 positive CRUD tests and 8 negative tests
- **Independent tests**: each test creates its own booking through a fixture, so tests can run in any order or in parallel
- **Reusable auth fixture**: logs in once per test and passes the token to the tests that need it
- **Test data builder**: unique booking data for every run, with easy overrides
- **Known bugs documented in code** with `test.fail()` and annotations
- **CI/CD**: GitHub Actions runs the suite on push and pull request, and uploads the HTML report

## Tech stack

| Tool | Purpose |
|---|---|
| Playwright Test | Test runner and HTTP client (`request` fixture) |
| JavaScript (Node.js) | Language |
| GitHub Actions | Continuous integration |
| Playwright HTML Reporter | Test reports |

## Test coverage

### Positive: booking CRUD (`tests/booking-crud.spec.js`)

| Endpoint | Scenario | Expected |
|---|---|---|
| `POST /booking` | Create a booking | 200, body matches the request |
| `GET /booking/:id` | Fetch the created booking | 200, correct data |
| `GET /booking?firstname=` | Filter bookings by name | 200, result includes the new booking |
| `PUT /booking/:id` | Replace the whole booking | 200, all fields updated |
| `PATCH /booking/:id` | Update some fields | 200, only those fields change |
| `DELETE /booking/:id` | Delete the booking | 201, then `GET` returns 404 |

### Negative (`tests/booking-negative.spec.js`)

| Scenario | Expected |
|---|---|
| Login with a wrong password | No token returned |
| `PUT` without a token | 403 Forbidden |
| `PATCH` with an invalid token | 403 Forbidden |
| `DELETE` without a token | 403, and the booking still exists |
| `GET` a booking that does not exist | 404 |
| `DELETE` a booking that does not exist | Rejected (405) |
| `POST` a booking without `firstname` | Should be 400 (known bug) |
| `POST` a booking with an empty body | Should be 400 (known bug) |

## Bugs and API quirks found

| # | Issue | Expected | Actual |
|---|---|---|---|
| 1 | Missing required field when creating a booking | 400 Bad Request | 500 Internal Server Error |
| 2 | Empty body when creating a booking | 400 Bad Request | 500 Internal Server Error |
| 3 | Failed login | 401 Unauthorized | 200 OK with `"reason": "Bad credentials"` |
| 4 | Successful delete | 200 OK or 204 No Content | 201 Created |
| 5 | Delete a booking that does not exist | 404 Not Found | 405 Method Not Allowed |

Bugs 1 and 2 are marked with `test.fail()`: the tests state the correct behaviour, so Playwright will flag them if the API is ever fixed.

## Project structure

```
├── .github/workflows/api-tests.yml   # CI pipeline
├── fixtures/api.js                   # auth token and booking fixtures
├── test-data/booking.js              # booking data builder and credentials
├── tests/
│   ├── booking-crud.spec.js          # positive CRUD tests
│   └── booking-negative.spec.js      # negative tests
└── playwright.config.js              # base URL, headers, reporters
```

## How to run

Requirements: Node.js 18 or newer.

```bash
npm install
npx playwright test
```

No browser install is needed, because the tests only send HTTP requests.

Open the HTML report after a run:

```bash
npx playwright show-report
```

## Continuous integration

The workflow in `.github/workflows/api-tests.yml` runs on every push and pull request to `main`, and can also be started by hand from the **Actions** tab. The HTML report is saved as a downloadable artifact for 14 days.

## Note

Restful-Booker is a public practice API that resets about every 10 minutes and is shared by many users, so an occasional timeout is caused by the server, not the tests.

## Author

**Sara Anisa Rahman**, Software Development Engineer in Test
[LinkedIn](https://www.linkedin.com/in/sara-anisa-rahman) · [GitHub](https://github.com/saraanisarahman)