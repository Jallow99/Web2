// Path: frontend/src/app/components/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // For reactive forms
import { AuthService } from '../../service/auth.service'; // Import Auth Service
import { Router } from '@angular/router'; // For navigation
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [ReactiveFormsModule, CommonModule, NavbarComponent], // Import ReactiveFormsModule for form handling
  styleUrls: [], // No specific styles for login component
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup; // Use definite assignment assertion
  errorMessage: string = ''; // To display error messages from backend

  constructor(
    private fb: FormBuilder, // Inject FormBuilder
    private authService: AuthService, // Inject Auth Service
    private router: Router // Inject Router
  ) {}

  ngOnInit(): void {
    // Initialize the login form with form controls and validators
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Email must be required and a valid email format
      password: ['', [Validators.required, Validators.minLength(6)]], // Password must be required and at least 6 characters
    });
  }

  // Getter for easy access to form fields in the template
  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.errorMessage = ''; // Clear previous error message

    // If the form is invalid, stop here
    if (this.loginForm.invalid) {
      // Mark all fields as touched to display validation errors
      this.loginForm.markAllAsTouched();
      return;
    }

    // Call the login method from AuthService
    this.authService
      .login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe({
        next: (response) => {
          // On successful login, navigate to the tasks page
          this.router.navigate(['/tasks']);
        },
        error: (err) => {
          // On error, display the error message from the backend
          this.errorMessage =
            err.error?.message || 'Login failed. Please try again.';
          console.error('Login error:', err);
        },
      });
  }
}
