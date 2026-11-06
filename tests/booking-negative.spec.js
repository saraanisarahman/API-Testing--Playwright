const { test, expect } = require('../fixtures/api');
const { createBookingPayload } = require('../test-data/booking');

test.describe('Auth - negative', () => {
  test('POST /auth with wrong password gives no token', async ({ request }) => {
    const res = await request.post('/auth', {
      data: { username: 'admin', password: 'wrong-password' },
    });

    // Known quirk: a failed login returns 200, not 401. The body explains the failure.
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.reason).toBe('Bad credentials');
    expect(body.token).toBeUndefined();
  });
});

test.describe('Protected endpoints without a valid token', () => {
  test('PUT without token is forbidden', async ({ request, booking }) => {
    const res = await request.put(`/booking/${booking.id}`, {
      data: createBookingPayload({ lastname: 'Hacker' }),
    });
    expect(res.status()).toBe(403);
  });

  test('PATCH with an invalid token is forbidden', async ({ request, booking }) => {
    const res = await request.patch(`/booking/${booking.id}`, {
      headers: { Cookie: 'token=invalid123' },
      data: { totalprice: 1 },
    });
    expect(res.status()).toBe(403);
  });

  test('DELETE without token is forbidden and the booking survives', async ({ request, booking }) => {
    const res = await request.delete(`/booking/${booking.id}`);
    expect(res.status()).toBe(403);

    const getRes = await request.get(`/booking/${booking.id}`);
    expect(getRes.status()).toBe(200);
  });
});

test.describe('Missing or unknown bookings', () => {
  test('GET a booking id that does not exist returns 404', async ({ request }) => {
    const res = await request.get('/booking/999999999');
    expect(res.status()).toBe(404);
  });

  test('DELETE a booking id that does not exist is rejected', async ({ request, token }) => {
    const res = await request.delete('/booking/999999999', {
      headers: { Cookie: `token=${token}` },
    });
    // Known quirk: the API answers 405 Method Not Allowed instead of 404.
    expect(res.status()).toBe(405);
  });
});

test.describe('Invalid booking data', () => {
  test('POST /booking without firstname should return 400 (known bug: returns 500)', async ({ request }) => {
    // Marked as an expected failure: the test states the correct behaviour (400 Bad Request),
    // the API actually crashes with 500. If the bug is ever fixed, Playwright will flag it.
    test.fail();
    test.info().annotations.push({
      type: 'bug',
      description: 'Missing required field returns 500 Internal Server Error instead of 400',
    });

    const { firstname, ...payload } = createBookingPayload();
    const res = await request.post('/booking', { data: payload });
    expect(res.status()).toBe(400);
  });

  test('POST /booking with an empty body should return 400 (known bug: returns 500)', async ({ request }) => {
    test.fail();
    test.info().annotations.push({
      type: 'bug',
      description: 'Empty body returns 500 Internal Server Error instead of 400',
    });

    const res = await request.post('/booking', { data: {} });
    expect(res.status()).toBe(400);
  });
});