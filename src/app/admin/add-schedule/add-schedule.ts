import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-schedule.html',
  styleUrls: ['../admin-forms.css']
})
export class AddSchedule {
  busId: number | null = null;
  routeId: number | null = null;
  departureTime = '';
  arrivalTime = '';
  fare: number | null = null;
  recurrence = 'NONE';

  errorMsg = '';
  successMsg = '';

  private http = inject(HttpClient);

  submitForm(form: NgForm) {
    this.errorMsg = '';
    this.successMsg = '';

    const payload = {
      busId: this.busId,
      routeId: this.routeId,
      departureTime: this.departureTime,
      arrivalTime: this.arrivalTime,
      fare: this.fare,
      recurrence: this.recurrence
    };

    const token = localStorage.getItem('jwt') || '';
    const headers = { 
      'Authorization': `Bearer ${token}`, 
      'Content-Type': 'application/json' 
    };

    this.http.post('http://localhost:8080/admin/addSchedule', payload, { headers }).subscribe({
      next: () => {
        this.successMsg = 'Schedule added successfully!';
        form.resetForm({ recurrence: 'NONE' });
      },
      error: () => this.errorMsg = 'Failed to add schedule.'
    });
  }
}
