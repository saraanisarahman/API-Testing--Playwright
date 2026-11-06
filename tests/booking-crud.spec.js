const { test, expect } = require('../fixtures/api');
const { createBookingPayload } = require('../test-data/booking');

test.describe('Booking CRUD', () => {
  test('POST /booking creates a booking', async ({ request }) => {
    const payload = createBookingPayload();

    const res = await request.post('/booking', { data: payload });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.bookingid).toEqual(expect.any(Number));
    expect(body.booking).toEqual(payload);
  });

  test('GET /booking/:id returns the created booking', async ({ request, booking }) => {
    const res = await request.get(`/booking/${booking.id}`);

    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual(booking.data);
  });

  test('GET /booking?firstname= filters by name', async ({ request, booking }) => {
    const res = await request.get('/booking', {
      params: { firstname: booking.data.firstname },
    });

    expect(res.status()).toBe(200);
    const ids = (await res.json()).map((item) => item.bookingid);
    expect(ids).toContain(booking.id);
  });

  test('PUT /booking/:id replaces the whole booking', async ({ request, booking, token }) => {
    const updated = createBookingPayload({
      lastname: 'Anisa',
      totalprice: 300,
      depositpaid: false,
      additionalneeds: 'Late checkout',
    });

    const res = await request.put(`/booking/${booking.id}`, {
      headers: { Cookie: `token=${token}` },
      data: updated,
    });

    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual(updated);
  });

  test('PATCH /booking/:id updates only the given fields', async ({ request, booking, token }) => {
    const res = await request.patch(`/booking/${booking.id}`, {
      headers: { Cookie: `token=${token}` },
      data: { totalprice: 999, additionalneeds: 'Airport pickup' },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.totalprice).toBe(999);
    expect(body.additionalneeds).toBe('Airport pickup');
    // fields we did not send must stay the same
    expect(body.firstname).toBe(booking.data.firstname);
    expect(body.bookingdates).toEqual(booking.data.bookingdates);
  });

  test('DELETE /booking/:id removes the booking', async ({ request, booking, token }) => {
    const res = await request.delete(`/booking/${booking.id}`, {
      headers: { Cookie: `token=${token}` },
    });

    // Known quirk: the API returns 201 Created for a delete, not 200 or 204.
    expect(res.status()).toBe(201);

    const getRes = await request.get(`/booking/${booking.id}`);
    expect(getRes.status()).toBe(404);
  });
});