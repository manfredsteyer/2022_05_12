import { Flight } from '@flight-workspace/flight-lib';
import { Action, createReducer, on } from '@ngrx/store';
import * as FlightBookingActions from './flight-booking.actions';

export const flightBookingFeatureKey = 'flightBooking';

// FlightBookingAppState
export interface FlightBookingAppState {
  [flightBookingFeatureKey]: FlightBookingState;
}

export interface FlightBookingState {
  flights: Flight[];
  // passenger: Passenger[];  // Normalisierung
  // tickets: Ticket[];
  negativeList: number[];
  stats: unknown;
  basket: unknown;
}

export const initialState: FlightBookingState = {
  flights: [],
  negativeList: [4],
  stats: {},
  basket: {}
};

export const reducer = createReducer(
  initialState,

  on(FlightBookingActions.flightsLoaded, (state, action) =>  {

    const flights = action.flights;

    // Verboten --> Mutation
    // state.flights = flights;

    // Immutable
    return {...state, flights}

  }),

  on(FlightBookingActions.updateFlight, (state, action) =>  {

    const flight = action.flight;
    const flights = state.flights.map(f => f.id === flight.id ? flight : f);

    // Immutable
    return {...state, flights}

  }),

);
