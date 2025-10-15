import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-route',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-route.html',
  styleUrls: ['../admin-forms.css']
})
export class AddRoute {
  source = '';
  destination = '';
  distance: number | null = null;
  duration = '';
  errorMsg = '';
  successMsg = '';

  private http = inject(HttpClient);

  submitForm() {
    this.errorMsg = '';
    this.successMsg = '';

    const payload = { source: this.source, destination: this.destination, distance: this.distance, duration: this.duration };

    // Attach JWT token
    const token = localStorage.getItem('jwt') || '';
    const headers = { 
      'Authorization': `Bearer ${token}`, 
      'Content-Type': 'application/json' 
    };

    this.http.post('http://localhost:8080/admin/addRoute', payload, { headers }).subscribe({
      next: () => {
        this.successMsg = 'Route added successfully!';
        this.resetForm();
      },
      error: () => this.errorMsg = 'Failed to add route.'
    });
  }

  resetForm() {
    this.source = '';
    this.destination = '';
    this.distance = null;
  this.duration = '';
  }
}
