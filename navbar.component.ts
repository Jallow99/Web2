// Path: frontend/src/app/components/navbar/navbar.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/user.model'; // Import User interface
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngIf, ngFor, etc.

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [RouterModule, CommonModule], // Import RouterModule for navigation
  styleUrls: [], // No specific styles for navbar component
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  currentUser: User | null = null; // To store current user information

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Subscribe to authentication status changes
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });

    // Subscribe to current user changes
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirect to login page after logout
  }
}
