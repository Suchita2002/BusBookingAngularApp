import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface AuthRequest {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
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

    // Call Spring Boot API
    this.http.post<string>('http://localhost:8080/login', payload)
      .subscribe({
        next: (jwt: string) => {
          localStorage.setItem('jwt', jwt); // store JWT
          alert('Login successful!');
          this.router.navigate(['/home']); // redirect to home page
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
