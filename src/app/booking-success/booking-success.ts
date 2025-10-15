import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../shared/header/header';

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
  selector: 'app-booking-success',
  standalone: true,
  imports: [CommonModule, Header],
  templateUrl: './booking-success.html',
  styleUrls: ['./booking-success.css']
})
export class BookingSuccess implements OnInit {
  route: string = '';
  date: string = '';
  seats: string = '';
  name: string = '';
  phone: string = '';
  departureTime: string = '';
  selectedBus: ScheduleDTO | null = null;

  ngOnInit(): void {
    const bookingResponse = localStorage.getItem('bookingResponse');
    const busStr = localStorage.getItem('selectedBus');

    if (!bookingResponse || !busStr) {
      alert('Booking details missing.');
      return;
    }

    const bookingData = JSON.parse(bookingResponse);
    this.seats = bookingData.seatNumbers;
    this.date = bookingData.bookingDate;
    this.name = localStorage.getItem('finalName') || '';
    this.phone = localStorage.getItem('finalPhone') || '';

    // ✅ Parse selectedBus object
    this.selectedBus = JSON.parse(busStr);

    if (this.selectedBus) {
      this.route = `${this.selectedBus.source} → ${this.selectedBus.destination}`;
      this.departureTime = new Date(this.selectedBus.departureTime).toLocaleString();
    }
  }
}
