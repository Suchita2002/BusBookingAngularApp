import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Header } from '../shared/header/header';

interface AuthRequest {
  email: string;
  password: string;
}

interface LoginResponseDTO {
  token: string;
  email: string;
  role: string; // ROLE_USER or ROLE_ADMIN
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, Header],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  username: string = '';
  password: string = '';
  errorMsg: string = '';

  private router = inject(Router);
  private http = inject(HttpClient);

  login() {
    const email = this.username.trim();
    const pass = this.password.trim();

    if (!email || !pass) {
      this.errorMsg = 'Please fill in both fields.';
      return;
    }

    const payload: AuthRequest = { email, password: pass };

    this.http.post<ApiResponse<LoginResponseDTO>>('http://localhost:8080/login', payload)
      .subscribe({
        next: (res) => {
          if (res.success && res.data) {
            const loginData = res.data;
            // Store JWT and role
            localStorage.setItem('jwt', loginData.token);
            localStorage.setItem('role', loginData.role);
            localStorage.setItem('email', loginData.email);

            // alert('Login successful!');

            // Redirect based on role
            if (loginData.role === 'ROLE_ADMIN') {
              this.router.navigate(['/admin']); // admin panel route
            } else {
              this.router.navigate(['/home']); // regular user home page
            }
          } else {
            this.errorMsg = res.message || 'Login failed.';
          }
        },
        error: (err) => {
          console.error(err);
          this.errorMsg = err.error?.message || 'Invalid credentials.';
        }
      });
  }

  register() {
    this.router.navigate(['/register']); // navigate to register page
  }
}
