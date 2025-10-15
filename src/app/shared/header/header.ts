import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { jwtDecode } from 'jwt-decode'; // ✅ Add this line at the top

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NgIf, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {
  private router = inject(Router);

  // ✅ Replace your old isLoggedIn() with this updated version
  isLoggedIn(): boolean {
    const token = localStorage.getItem('jwt');
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert to seconds

      // 🔒 If token expired, clear it and return false
      if (decoded.exp && decoded.exp <= currentTime) {
        localStorage.removeItem('jwt');
        return false;
      }

      return true;
    } catch {
      localStorage.removeItem('jwt');
      return false;
    }
  }

  openLoginPage() {
    this.router.navigate(['/login']);
  }

  openBookingPage() {
    this.router.navigate(['/search']);
  }

  logout() {
    localStorage.removeItem('jwt');
    alert('Logged out successfully!');
    this.router.navigate(['/home']);
  }
}
