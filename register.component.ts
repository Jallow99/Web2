// Path: frontend/src/app/components/register/register.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar.component"; 

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [], // No specific styles for register component
  imports: [ReactiveFormsModule, CommonModule, NavbarComponent], // Import ReactiveFormsModule for form handling
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize the registration form with validation rules
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: this.passwordMatchValidator, // Custom validator for password confirmation
      }
    );
  }

  // Custom validator function to check if password and confirmPassword match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    // Set 'mismatch' error on confirmPassword control if they don't match
    return password === confirmPassword ? null : { mismatch: true };
  }

  // Getter for easy access to form fields in the template
  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.errorMessage = ''; // Clear previous error message

    // If the form is invalid, mark all fields as touched and stop
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { name, email, password } = this.registerForm.value;

    // Call the register method from AuthService
    this.authService.register(name, email, password).subscribe({
      next: (response) => {
        // On successful registration, navigate to the login page
        console.log('Registration successful:', response);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        // On error, display the error message from the backend
        this.errorMessage =
          err.error?.message || 'Registration failed. Please try again.';
        console.error('Registration error:', err);
      },
    });
  }
}
