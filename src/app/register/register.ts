import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface matches Spring Boot User entity
interface RegisterRequest {
  fullName: string;
  gender: string;
  dob: string;          // format: YYYY-MM-DD
  mobileNumber: string;
  email: string;
  password: string;
  role: string;         // always "ROLE_USER"
}

// Response interface matches ApiResponse from backend
interface ApiResponse {
  success: boolean;
  message: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  fullname = '';
  gender = '';
  dob = '';
  mobile = '';
  email = '';
  password = '';
  confirmPassword = '';
  terms = false;
  errorMsg = '';

  private router = inject(Router);
  private http = inject(HttpClient);

  ngOnInit() {
    // Set maximum date for DOB to today
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm: any = today.getMonth() + 1;
    let dd: any = today.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    this.dob = `${yyyy}-${mm}-${dd}`;
  }

  submitForm() {
    this.errorMsg = '';

    // Basic validation
    if (this.password !== this.confirmPassword) {
      this.errorMsg = 'Passwords do not match!';
      return;
    }

    if (!this.terms) {
      this.errorMsg = 'You must agree to the Terms & Conditions.';
      return;
    }

    const payload: RegisterRequest = {
      fullName: this.fullname,
      gender: this.gender,
      dob: this.dob,
      mobileNumber: this.mobile,
      email: this.email,
      password: this.password,
      role: 'ROLE_USER' // fixed for all new users
    };

    this.registerUser(payload).subscribe({
      next: (response: ApiResponse) => {
        if (response.success) {
          alert(response.message); // show backend message
          this.router.navigate(['/login']); // navigate to login page
        } else {
          this.errorMsg = response.message;
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = err.error?.message || 'Registration failed. Try again.';
      }
    });
  }

  private registerUser(data: RegisterRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>('http://localhost:8080/register', data);
  }
}
