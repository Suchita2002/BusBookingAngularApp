import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Header } from '../shared/header/header';

// Seat model
interface SeatModel {
  number: number;
  booked: boolean;
  selected: boolean;
  ladies: boolean;
}

@Component({
  selector: 'app-seat',
  standalone: true,
  imports: [CommonModule, Header],
  templateUrl: './seat.html',
  styleUrls: ['./seat.css']
})
export class Seat implements OnInit {
  seats: SeatModel[] = [];
  scheduleId!: number;
  busId!: number;
  busCapacity = 40; // default if not fetched
  bookedSeats: string[] = [];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const scheduleIdStr = localStorage.getItem('selectedScheduleId');
    if (!scheduleIdStr) {
      alert('No schedule selected!');
      this.router.navigate(['/search']);
      return;
    }

    this.scheduleId = +scheduleIdStr;
    this.fetchScheduleDetails();
  }

  /** Step 1: Fetch schedule details (to get busId) */
  fetchScheduleDetails(): void {
    const token = localStorage.getItem('jwt');
    let headers = new HttpHeaders();
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);

    this.http
      .get<any>(`http://localhost:8080/user/bookings/schedule/${this.scheduleId}`, { headers })
      .subscribe({
        next: (response) => {
          const schedule = response.data;
          this.busId = schedule.busId;
          this.fetchBusCapacity();
        },
        error: (err) => {
          console.error('Error fetching schedule details:', err);
          alert('Could not load schedule details.');
        }
      });
  }

  /** Step 2: Fetch bus capacity */
  fetchBusCapacity(): void {
  const token = localStorage.getItem('jwt');
  let headers = new HttpHeaders();
  if (token) headers = headers.set('Authorization', `Bearer ${token}`);

  this.http
    .get<any>(`http://localhost:8080/user/buses/${this.busId}`, { headers })
    .subscribe({
      next: (response) => {
        const bus = response.data || response; // handle ApiResponse wrapper
        this.busCapacity = bus.totalSeats || 40;
        this.fetchBookedSeats();
      },
      error: (err) => {
        console.error('Error fetching bus capacity:', err);
        // fallback if something goes wrong
        this.fetchBookedSeats();
      }
    });
}

  /** Step 3: Fetch already booked seats */
  fetchBookedSeats(): void {
    const token = localStorage.getItem('jwt');
    let headers = new HttpHeaders();
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);

    this.http
      .get<any>(`http://localhost:8080/user/bookings/schedule/${this.scheduleId}/seats`, { headers })
      .subscribe({
        next: (response) => {
          this.bookedSeats = response.data || [];
          this.generateSeatMap();
        },
        error: (err) => {
          console.error('Error fetching booked seats:', err);
          this.generateSeatMap();
        }
      });
  }

  /** Step 4: Generate seat map dynamically */
  generateSeatMap(): void {
    const seats: SeatModel[] = [];
    for (let i = 1; i <= this.busCapacity; i++) {
      const isBooked = this.bookedSeats.includes(i.toString());
      seats.push({
        number: i,
        booked: isBooked,
        selected: false,
        ladies: !isBooked && Math.random() < 0.1
      });
    }
    this.seats = seats;
  }

  /** Toggle seat selection */
  toggleSeat(seat: SeatModel): void {
    if (seat.booked) return;
    seat.selected = !seat.selected;
  }

  /** Confirm booking */
  confirmBooking(): void {
    const selectedSeats = this.seats.filter((s) => s.selected).map((s) => s.number);
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat.');
      return;
    }

    localStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
    this.router.navigate(['/confirm-booking']);
  }
}
