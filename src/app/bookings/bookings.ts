import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgIf, NgForOf } from '@angular/common';
import { BookingService, Booking } from '../services/booking';
import { Router } from '@angular/router';
import { Header } from '../shared/header/header';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, NgIf, NgForOf, Header],
  templateUrl: './bookings.html',
  styleUrls: ['./bookings.css']
})
export class Bookings implements OnInit {
  private bookingService = inject(BookingService);
  private router = inject(Router);

  upcomingBookings: Booking[] = [];
  completedBookings: Booking[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit() {
    // Redirect if not logged in
    if (!localStorage.getItem('jwt')) {
      this.router.navigate(['/login']);
      return;
    }

    this.bookingService.getUserBookingsWithSchedule().subscribe({
      next: bookings => {
        const now = new Date();

        // Split upcoming vs past based on schedule departure time
        this.upcomingBookings = bookings.filter(
          b => b.schedule && new Date(b.schedule.departureTime) >= now
        );

        this.completedBookings = bookings.filter(
          b => b.schedule && new Date(b.schedule.departureTime) < now
        );

        this.loading = false;
      },
      error: err => {
        this.error = 'Failed to fetch bookings.';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
