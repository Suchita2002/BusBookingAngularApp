import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Bus {
  id: number;
  busNumber: string;
  type: string;
  totalSeats: number;
}

@Component({
  selector: 'app-bus-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bus-list.html',
  styleUrls: ['../admin-forms.css']
})
export class BusList {
  private http = inject(HttpClient);
  buses: Bus[] = [];
  loading = true;
  errorMsg = '';

  ngOnInit() {
    this.loadBuses();
  }

  loadBuses() {
    const token = localStorage.getItem('jwt') || '';
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.get<Bus[]>('http://localhost:8080/admin/buses', { headers })
      .subscribe({
        next: (data) => {
          this.buses = data;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.errorMsg = 'Failed to load buses. Try again later.';
          this.loading = false;
        }
      });
  }

  deleteBus(busId: number) {
    if (!confirm('Are you sure you want to delete this bus?')) return;

    const token = localStorage.getItem('jwt') || '';
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.delete(`http://localhost:8080/admin/buses/${busId}`, { headers })
      .subscribe({
        next: () => this.buses = this.buses.filter(b => b.id !== busId),
        error: (err) => console.error('Failed to delete bus', err)
      });
  }

  private router = inject(Router);
  editBus(bus: Bus) {
  // Navigate to the update page with the bus ID
  this.router.navigate(['/admin/update-bus', bus.id]);
}
}
