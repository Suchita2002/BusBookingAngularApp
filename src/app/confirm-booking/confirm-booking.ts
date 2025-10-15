import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Header } from '../shared/header/header';

interface BookingResponseDTO {
  id: number;
  seatNumbers: string;
  status: string;
  bookingDate: string;
  scheduleId: number;
  userId: number;
  userName: string;
}

interface ScheduleDTO {
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

@Component({
  selector: 'app-book-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule, Header],
  templateUrl: './confirm-booking.html',
  styleUrls: ['./confirm-booking.css']
})
export class ConfirmBooking implements OnInit {
  selectedBus: ScheduleDTO | null = null; // now an object
  selectedDate: string = '';
  selectedSeats: number[] = [];
  fullName: string = '';
  phone: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const busStr = localStorage.getItem('selectedBus');
    const date = localStorage.getItem('selectedDate');
    const seats = localStorage.getItem('selectedSeats');

    if (!busStr || !date || !seats) {
      alert('Booking details missing. Please start over.');
      this.router.navigate(['/search']);
      return;
    }

    // ✅ Parse selectedBus as object
    this.selectedBus = JSON.parse(busStr);
    this.selectedDate = date;
    this.selectedSeats = JSON.parse(seats);

    // Optional: prefill name and phone if already stored
    this.fullName = localStorage.getItem('finalName') || '';
    this.phone = localStorage.getItem('finalPhone') || '';
  }

  bookNow(): void {
    if (!this.fullName.trim() || !this.phone.trim()) {
      alert('Please fill in your name and phone number.');
      return;
    }

    if (!this.selectedBus) {
      alert('Schedule missing. Please search again.');
      this.router.navigate(['/search']);
      return;
    }

    const bookingRequest = {
      seatNumbers: this.selectedSeats.join(','),
      scheduleId: this.selectedBus.id,
      travelDate: this.selectedDate,
      passengerName: this.fullName,
      passengerPhone: this.phone
    };

    const token = localStorage.getItem('jwt');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);

    this.http.post<any>(
      `http://localhost:8080/user/bookings`,
      bookingRequest,
      { headers }
    ).subscribe({
      next: (response) => {
        const bookingData = response.data;

        // ✅ Store full booking details for success screen
        localStorage.setItem('bookingResponse', JSON.stringify(bookingData));
        localStorage.setItem('finalName', this.fullName);
        localStorage.setItem('finalPhone', this.phone);

        this.router.navigate(['/booking-success']);
      },
      error: (err) => {
        console.error('Booking failed:', err);
        alert('Booking failed. Please try again.');
      }
    });
  }
}
