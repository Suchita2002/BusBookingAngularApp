import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-update-bus',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './update-bus.html',
  styleUrls: ['../admin-forms.css']
})
export class UpdateBus {
  busId!: number;
  busNumber = '';
  busType = '';
  capacity: number | null = null;
  errorMsg = '';
  successMsg = '';

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit() {
    this.busId = +this.route.snapshot.paramMap.get('id')!;
    this.loadBus();
  }

  loadBus() {
    const token = localStorage.getItem('jwt') || '';
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.get<any>(`http://localhost:8080/admin/buses/${this.busId}`, { headers })
      .subscribe({
        next: (bus) => {
          this.busNumber = bus.busNumber;
          this.busType = bus.type;
          this.capacity = bus.totalSeats;
        },
        error: (err) => {
          console.error(err);
          this.errorMsg = 'Failed to load bus details.';
        }
      });
  }

  submitForm() {
    const payload = {
      busNumber: this.busNumber,
      type: this.busType,
      totalSeats: this.capacity
    };

    const token = localStorage.getItem('jwt') || '';
    const headers = { 
      'Authorization': `Bearer ${token}`, 
      'Content-Type': 'application/json'
    };

    this.http.put(`http://localhost:8080/admin/buses/${this.busId}`, payload, { headers })
      .subscribe({
        next: () => {
          this.successMsg = 'Bus updated successfully!';
          setTimeout(() => this.router.navigate(['/buses']), 1000);
        },
        error: (err) => {
          console.error(err);
          this.errorMsg = 'Failed to update bus.';
        }
      });
  }
}
