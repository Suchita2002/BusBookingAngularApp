import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-schedule-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schedule-list.html',
  styleUrls: ['../admin-forms.css']
})
export class ScheduleListComponent implements OnInit {
  schedules: any[] = [];
  loading = true;
  errorMsg = '';
  private http = inject(HttpClient);
  private router = inject(Router);

  ngOnInit() {
    this.loadSchedules();
  }

  loadSchedules() {
    const token = localStorage.getItem('jwt') || '';
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.get<any[]>('http://localhost:8080/admin/schedules', { headers })
      .subscribe({
        next: (data) => {
          this.schedules = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load schedules', err);
          this.errorMsg = 'Failed to load schedules. Try again later.';
          this.loading = false;
        }
      });
  }

  deleteSchedule(scheduleId: number) {
    if (!confirm('Are you sure you want to delete this schedule?')) return;

    const token = localStorage.getItem('jwt') || '';
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.delete(`http://localhost:8080/admin/schedules/${scheduleId}`, { headers })
      .subscribe({
        next: () => this.schedules = this.schedules.filter(s => s.id !== scheduleId),
        error: (err) => console.error('Failed to delete schedule', err)
      });
  }

  editSchedule(scheduleId: number) {
    // 👇 Navigate to the update form
    this.router.navigate(['/admin/update-schedule', scheduleId]);
  }

  formatDateTime(dt: string): string {
    return new Date(dt).toLocaleString();
  }
}
