import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-update-route',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './update-route.html',
  styleUrls: ['../admin-forms.css']
})
export class UpdateRoute {
  routeId!: number;
  source = '';
  destination = '';
  distance: number | null = null;
  duration = '';
  errorMsg = '';
  successMsg = '';

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit() {
    this.routeId = +this.route.snapshot.paramMap.get('id')!;
    this.loadRoute();
  }

  loadRoute() {
    const token = localStorage.getItem('jwt') || '';
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.get<any>(`http://localhost:8080/admin/routes/${this.routeId}`, { headers })
      .subscribe({
        next: (data) => {
          this.source = data.source;
          this.destination = data.destination;
          this.distance = data.distance;
          this.duration = data.duration;
        },
        error: (err) => {
          console.error(err);
          this.errorMsg = 'Failed to load route details.';
        }
      });
  }

  submitForm() {
    const payload = { source: this.source, destination: this.destination, distance: this.distance, duration: this.duration };
    const token = localStorage.getItem('jwt') || '';
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    this.http.put(`http://localhost:8080/admin/routes/${this.routeId}`, payload, { headers })
      .subscribe({
        next: () => {
          this.successMsg = 'Route updated successfully!';
          setTimeout(() => this.router.navigate(['/admin/routes']), 1000);
        },
        error: (err) => {
          console.error(err);
          this.errorMsg = 'Failed to update route.';
        }
      });
  }
}
