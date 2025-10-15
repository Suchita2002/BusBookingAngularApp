import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-route-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './route-list.html',
  styleUrls: ['../admin-forms.css']
})
export class RouteListComponent implements OnInit {
  routes: any[] = [];
  loading = true;
  errorMsg = '';
  private http = inject(HttpClient);
  private router = inject(Router);

  ngOnInit() {
    this.loadRoutes();
  }

  loadRoutes() {
    const token = localStorage.getItem('jwt') || '';
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.get<any[]>('http://localhost:8080/admin/routes', { headers })
      .subscribe({
        next: (data) => {
          this.routes = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load routes', err);
          this.errorMsg = 'Failed to load routes. Try again later.';
          this.loading = false;
        }
      });
  }

  deleteRoute(routeId: number) {
    if (!confirm('Are you sure you want to delete this route?')) return;

    const token = localStorage.getItem('jwt') || '';
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.delete(`http://localhost:8080/admin/routes/${routeId}`, { headers })
      .subscribe({
        next: () => this.routes = this.routes.filter(r => r.id !== routeId),
        error: (err) => console.error('Failed to delete route', err)
      });
  }

  editRoute(route: any) {
    this.router.navigate(['/admin/update-route', route.id]);
  }
}
