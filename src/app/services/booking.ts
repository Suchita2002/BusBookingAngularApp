import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, of, map, switchMap } from 'rxjs';

// ================= Interfaces =================
export interface ScheduleResponse {
  id: number;
  busId: number;
  busNumber: string;
  routeId: number;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  fare: number;
}

export interface Booking {
  id: number;
  seatNumbers: string;
  status: string;
  bookingDate: string;
  scheduleId: number;
  userId: number;
  userName: string;
  schedule?: ScheduleResponse; // optional schedule info
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ================= Service =================
@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private userBookingsApi = 'http://localhost:8080/user/bookings';
  private adminBookingsApi = 'http://localhost:8080/admin/bookings';
  private scheduleApi = 'http://localhost:8080/user/bookings/schedule';

  constructor(private http: HttpClient) {}

  // ---------------- User Functions ----------------

  getUserBookings(): Observable<Booking[]> {
    const jwt = localStorage.getItem('jwt') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwt}` });

    return this.http.get<ApiResponse<Booking[]>>(this.userBookingsApi, { headers })
      .pipe(map(res => res.data));
  }

  getSchedule(scheduleId: number): Observable<ScheduleResponse> {
    const jwt = localStorage.getItem('jwt') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwt}` });

    return this.http.get<ApiResponse<ScheduleResponse>>(`${this.scheduleApi}/${scheduleId}`, { headers })
      .pipe(map(res => res.data));
  }

  // Fetch bookings along with their schedule info
  getUserBookingsWithSchedule(): Observable<Booking[]> {
    return this.getUserBookings().pipe(
      switchMap(bookings => {
        if (!bookings || bookings.length === 0) return of([] as Booking[]); // no bookings
        const requests = bookings.map(b =>
          this.getSchedule(b.scheduleId).pipe(
            map(schedule => ({ ...b, schedule }))
          )
        );
        return forkJoin(requests); // combine all observables into one Observable<Booking[]>
      })
    );
  }

  // ---------------- Admin Functions ----------------

  getAllBookings(): Observable<Booking[]> {
    const jwt = localStorage.getItem('jwt') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwt}` });

    return this.http.get<ApiResponse<Booking[]>>(this.adminBookingsApi, { headers })
      .pipe(
        map(res => res.data),
        // Optional: fetch schedules for admin view as well
        switchMap(bookings => {
          if (!bookings || bookings.length === 0) return of([] as Booking[]);
          const requests = bookings.map(b =>
            this.getSchedule(b.scheduleId).pipe(
              map(schedule => ({ ...b, schedule }))
            )
          );
          return forkJoin(requests);
        })
      );
  }
}
