import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-bus',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-bus.html',
  styleUrls: ['../admin-forms.css']
})
export class AddBus {
  busNumber = '';
  busType = '';
  capacity: number | null = null;
  errorMsg = '';
  successMsg = '';

  private http = inject(HttpClient);

  submitForm() {
    this.errorMsg = '';
    this.successMsg = '';

    // Correct field names for backend DTO
    const payload = { 
      busNumber: this.busNumber, 
      type: this.busType, 
      totalSeats: this.capacity 
    };

    // Attach JWT token
    const token = localStorage.getItem('jwt') || '';
    const headers = { 
      'Authorization': `Bearer ${token}`, 
      'Content-Type': 'application/json' 
    };

    this.http.post('http://localhost:8080/admin/addBus', payload, { headers }).subscribe({
      next: () => {
        this.successMsg = 'Bus added successfully!';
        this.resetForm();
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Failed to add bus. Make sure you are logged in as admin.';
      }
    });
  }

  resetForm() {
    this.busNumber = '';
    this.busType = '';
    this.capacity = null;
  }
}
