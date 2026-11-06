// Builds a fresh booking body for each test.
// A unique first name keeps tests independent, since the API resets every ~10 minutes
// and other people use the same public server.
function createBookingPayload(overrides = {}) {
  const unique = Date.now().toString().slice(-6);
  return {
    firstname: `John${unique}`,
    lastname: 'Doe',
    totalprice: 150,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-12-01',
      checkout: '2026-12-05',
    },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}

const credentials = {
  username: 'admin',
  password: 'password123',
};

module.exports = { createBookingPayload, credentials };