const base = require('@playwright/test');
const { createBookingPayload, credentials } = require('../test-data/booking');

// Extends Playwright's test with two fixtures:
//   token   - logs in once and gives the auth token to any test that asks for it
//   booking - creates a new booking before the test and hands over its id and data
exports.test = base.test.extend({
  token: async ({ request }, use) => {
    const res = await request.post('/auth', { data: credentials });
    base.expect(res.status()).toBe(200);
    const { token } = await res.json();
    base.expect(token).toBeTruthy();
    await use(token);
  },

  booking: async ({ request }, use) => {
    const payload = createBookingPayload();
    const res = await request.post('/booking', { data: payload });
    base.expect(res.status()).toBe(200);
    const { bookingid } = await res.json();
    await use({ id: bookingid, data: payload });
  },
});

exports.expect = base.expect;