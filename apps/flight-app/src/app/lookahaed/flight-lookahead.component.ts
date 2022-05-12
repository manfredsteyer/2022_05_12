import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";

// RxJS 7 >= Angular 13
import { 
    debounceTime, 
    distinctUntilChanged, 
    filter, 
    map, 
    startWith, 
    switchMap, 
    tap, 
    withLatestFrom, 
    combineLatest, 
    interval, 
    Observable,
    share,
    shareReplay,
    Subject,
    ReplaySubject,
    delay,
    mergeMap,
    concatMap,
    exhaustMap,
    catchError,
    throwError,
    of,
    takeUntil,
    lastValueFrom,
    firstValueFrom
} 
from 'rxjs';

import { Flight } from '@flight-workspace/flight-lib';

@Component({
    selector: 'flight-lookahead',
    templateUrl: './flight-lookahead.component.html'
})

export class FlightLookaheadComponent implements OnDestroy {

    control: FormControl;
    flights$: Observable<Flight[]>;
    loading$ = new Subject<boolean>(); 

    online$!: Observable<boolean>;

    close$ = new Subject<void>();

    constructor(private http: HttpClient) {

        this.control = new FormControl();

        this.online$ = interval(2000).pipe(
            startWith(-1),
            tap(v => console.log('interval', v)),
            map(_ => Math.random() < 0.5),  // t, t, t, f, f, t, t
            map(_ => true),
            distinctUntilChanged(), // t, f, t
            // tap(v => console.log('v', v)),
            // share()
            
            shareReplay({bufferSize: 1, refCount: true})
            
            // RxJS 7 >= Angular 13
            // share({
            //     connector: () => new Subject(),
            //     resetOnRefCountZero: true
            // }),
            // share({
            //     connector: () => new ReplaySubject(10),
            //     resetOnRefCountZero: true,
            // })
        );

        // const sub = this.online$.subscribe();
        // setTimeout(() => {
        //     sub.unsubscribe();
        // }, 7000);

        this.online$.pipe(takeUntil(this.close$)).subscribe();
        
        const input$ = this.control.valueChanges.pipe(
            filter(input => input.length >= 3),
            debounceTime(300),
        );

        // // RxJS 7 >= Angular 13
        this.flights$ = combineLatest({input: input$, online: this.online$}).pipe(            filter(combined => combined.online),
            tap(() => this.loading$.next(true)),
            switchMap(combined => this.load(combined.input)),
            tap(() => this.loading$.next(false))
        );


        //     // RxJS 7 >= Angular 13
        // this.flights$ = input$.pipe(
        //     withLatestFrom(this.online$),
        //     filter(([, online]) => online),
        //     tap(() => this.loading = true),
        //     switchMap(([input, ]) => this.load(input)),
        //     tap(() => this.loading = false)
        // );

        // this.flights$ = this
        //                     .control
        //                     .valueChanges
        //                     .pipe(
        //                       debounceTime(300),
        //                       tap(() => this.loading = true),
        //                       switchMap(name => this.load(name)),
        //                       tap(() => this.loading = false)
        //                     );
    }
    ngOnDestroy(): void {
        this.close$.next();
        this.close$.complete();



    }

    load(from: string)  {
        const url = "http://www.angular.at/api/flight";

        const params = new HttpParams()
                            .set('from', from);

        const headers = new HttpHeaders()
                            .set('Accept', 'application/json');

        return this.http.get<Flight[]>(url, {params, headers}).pipe(
            // delay(7000)
            catchError(err => {
                console.error('err', err);
                // return throwError(() => err)
                return of([]);
            }),
        )

    };


}
