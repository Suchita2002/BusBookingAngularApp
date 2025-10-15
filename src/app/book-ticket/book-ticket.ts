import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-ticket.html',
  styleUrls: ['./book-ticket.css']
})
export class BookTicket implements OnInit {
  selectedBus = localStorage.getItem('selectedBus') || '';
  selectedDate = localStorage.getItem('selectedDate') || new Date().toISOString().split('T')[0];
  selectedSeats: string[] = JSON.parse(localStorage.getItem('selectedSeats') || '[]');
  fullName = '';
  phone = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {}

  bookTicket() {
    if (!this.fullName.trim() || !this.phone.trim()) {
      alert('Please fill all fields.');
      return;
    }

    const seatNumbers = this.selectedSeats.join(',');
    const scheduleId = localStorage.getItem('selectedScheduleId');
    const token = localStorage.getItem('jwt');

    if (!scheduleId || !token) {
      alert('You must be logged in to book tickets.');
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const bookingRequest = { scheduleId: +scheduleId, seatNumbers };

    this.http.post('http://localhost:8080/user/bookings', bookingRequest, { headers }).subscribe({
      next: () => {
        alert('Booking successful!');
        this.router.navigate(['/booking-success']);
      },
      error: (err) => {
        console.error('Booking failed:', err);
        alert('Something went wrong.');
      }
    });
  }
}
