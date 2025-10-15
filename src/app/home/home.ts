import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { Header } from '../shared/header/header';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgIf, Header],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  private router = inject(Router);

  // Check if user is logged in by JWT presence
  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwt');
  }

  openLoginPage() {
    this.router.navigate(['/login']);
  }

  openBookingPage() {
    this.router.navigate(['/search']);
  }

  // ✅ Navigate to bookings page
  openBookingsPage() {
    this.router.navigate(['/bookings']);
  }

  logout() {
    localStorage.removeItem('jwt');
    alert('Logged out successfully!');
    this.router.navigate(['/home']);
  }
}
