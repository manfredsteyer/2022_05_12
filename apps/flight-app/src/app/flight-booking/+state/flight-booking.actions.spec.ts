import * as fromFlightBooking from './flight-booking.actions';

describe('flightBookingFlightBookings', () => {
  it('should return an action', () => {
    expect(fromFlightBooking.flightsLoaded().type).toBe('[FlightBooking] FlightBooking FlightBookings');
  });
});
