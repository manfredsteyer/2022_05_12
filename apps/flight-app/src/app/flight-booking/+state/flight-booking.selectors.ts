import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromFlightBooking from './flight-booking.reducer';
import { FlightBookingAppState, flightBookingFeatureKey, FlightBookingState } from './flight-booking.reducer';

export const selectFlightBookingState = createFeatureSelector<FlightBookingState>(
  flightBookingFeatureKey
);

export const selectAllFlights = createSelector(
  selectFlightBookingState,
  (fbs) => fbs.flights
);

export const selectNegativeList = createSelector(
  selectFlightBookingState,
  (fbs) => fbs.negativeList
);

export const selectFilteredFlights = createSelector(
  selectAllFlights,
  selectNegativeList,
  (flights, negativeList) => flights.filter(f => !negativeList.includes(f.id))
);


// a => a.flightBooking


export const selectFlightsWithLambda = 
  (a: FlightBookingAppState) => a[flightBookingFeatureKey].flights;


export const selectFlights = createSelector( // Memorisieren
  (a: FlightBookingAppState) => a[flightBookingFeatureKey].flights,
  (a: FlightBookingAppState) => a[flightBookingFeatureKey].negativeList,
  (flights, negativeList) => flights.filter(f => !negativeList.includes(f.id))
);

export function selectFlightsWithout(negativeList: number[]) {
  return createSelector( // Memorisieren
    (a: FlightBookingAppState) => a[flightBookingFeatureKey].flights,
    (flights) => flights.filter(f => !negativeList.includes(f.id))
  );
}