import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookingService, Booking, ScheduleResponse } from '../../services/booking';
import { forkJoin } from 'rxjs';

interface BookingWithSchedule extends Booking {
  busNumber: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
}

interface ScheduleBookings {
  scheduleId: number;
  scheduleInfo: ScheduleResponse;
  bookings: BookingWithSchedule[];
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
  encapsulation: ViewEncapsulation.None
})
export class AdminDashboard implements OnInit {
  allBookings: Booking[] = [];
  groupedBookings: ScheduleBookings[] = [];
  private bookingService = inject(BookingService);
  private router = inject(Router);

  ngOnInit() {
    this.fetchBookings();
  }

  fetchBookings() {
    this.bookingService.getAllBookings().subscribe({
      next: bookings => {
        this.allBookings = bookings;

        // Get unique schedule IDs
        const scheduleIds = Array.from(new Set(bookings.map(b => b.scheduleId)));
        const scheduleRequests = scheduleIds.map(id => this.bookingService.getSchedule(id));

        forkJoin(scheduleRequests).subscribe({
          next: schedules => {
            this.groupBookingsWithSchedules(bookings, schedules);
          },
          error: err => console.error('Error fetching schedules', err)
        });
      },
      error: err => console.error('Error fetching bookings', err)
    });
  }

  private groupBookingsWithSchedules(bookings: Booking[], schedules: ScheduleResponse[]) {
    const map = new Map<number, ScheduleBookings>();

    bookings.forEach(b => {
      const schedule = schedules.find(s => s.id === b.scheduleId);
      if (!schedule) return;

      const bookingWithSchedule: BookingWithSchedule = {
        ...b,
        busNumber: schedule.busNumber,
        source: schedule.source,
        destination: schedule.destination,
        departureTime: schedule.departureTime,
        arrivalTime: schedule.arrivalTime
      };

      if (!map.has(b.scheduleId)) {
        map.set(b.scheduleId, { scheduleId: b.scheduleId, scheduleInfo: schedule, bookings: [] });
      }
      map.get(b.scheduleId)!.bookings.push(bookingWithSchedule);
    });

    this.groupedBookings = Array.from(map.values());
  }

  logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    alert('You have been logged out.');
    this.router.navigate(['/login']);
  }
}
