import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-schedule.html',
  styleUrls: ['../admin-forms.css']
})
export class UpdateSchedule implements OnInit {
  scheduleId!: number;
  busId: number | null = null;
  routeId: number | null = null;
  departureTime = '';
  arrivalTime = '';
  fare: number | null = null;

  successMsg = '';
  errorMsg = '';
  recurrence = 'NONE';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.scheduleId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadSchedule();
  }

  loadSchedule() {
    const token = localStorage.getItem('jwt') || '';
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.get<any>(`http://localhost:8080/admin/schedules/${this.scheduleId}`, { headers })
      .subscribe({
        next: (data) => {
          this.busId = data.busId;
          this.routeId = data.routeId;
          this.departureTime = this.formatForInput(data.departureTime);
          this.arrivalTime = this.formatForInput(data.arrivalTime);
          this.fare = data.fare;
        },
        error: (err) => {
          console.error('Error loading schedule:', err);
          this.errorMsg = 'Failed to load schedule details.';
        }
      });
  }

  formatForInput(dateTime: string): string {
    // Converts ISO date to 'yyyy-MM-ddTHH:mm' for input[type=datetime-local]
    return new Date(dateTime).toISOString().slice(0, 16);
  }

  submitForm(form: NgForm) {
    if (form.invalid) return;

    const token = localStorage.getItem('jwt') || '';
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const payload = {
      busId: this.busId,
      routeId: this.routeId,
      departureTime: this.departureTime,
      arrivalTime: this.arrivalTime,
      fare: this.fare,
      recurrence: this.recurrence || 'NONE'
    };

    this.http.put(`http://localhost:8080/admin/schedules/${this.scheduleId}`, payload, { headers })
      .subscribe({
        next: () => {
          this.successMsg = 'Schedule updated successfully!';
          setTimeout(() => this.router.navigate(['/admin/schedules']), 1500);
        },
        error: (err) => {
          console.error('Update failed:', err);
          this.errorMsg = 'Failed to update schedule.';
        }
      });
  }
}
