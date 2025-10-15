import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from '../shared/header/header';

interface ScheduleResponseDTO {
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
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, Header],
  templateUrl: './search.html',
  styleUrls: ['./search.css'] // Use your old styles.css
})
export class Search implements OnInit {
  from: string = '';
  to: string = '';
  date: string = '';
  schedules: ScheduleResponseDTO[] = [];

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    // Set default date = today
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    this.date = `${yyyy}-${mm}-${dd}`;
  }

  searchBuses() {
    if (!this.from.trim() || !this.to.trim() || !this.date) {
      alert('Please fill in all fields.');
      return;
    }



    const token = localStorage.getItem('jwt');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }


    // Call Spring Boot backend API
    this.http.get<ScheduleResponseDTO[]>(
      `http://localhost:8080/user/schedules?from=${this.from}&to=${this.to}&date=${this.date}`,
      { headers }
    ).subscribe({
      next: (res) => {
        this.schedules = res;
        if (res.length === 0) alert('No schedules found for this route/date.');
      },
      error: (err) => {
        console.error('Error fetching schedules:', err);
        alert('Could not fetch available buses.');
      }
    });
  }

  selectBus(schedule: ScheduleResponseDTO) {
  // Store full schedule object in localStorage
  localStorage.setItem('selectedScheduleId', schedule.id.toString());
  localStorage.setItem('selectedBus', JSON.stringify(schedule));  // ✅ store as object
  localStorage.setItem('selectedDate', this.date);
  localStorage.setItem('selectedFare', schedule.fare.toString());

  // Navigate to seat selection / confirm booking page
  this.router.navigate(['/seat']); // or /confirm-booking
}

}
