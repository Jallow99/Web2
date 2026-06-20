// Path: frontend/src/app/components/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common'; // Import CommonModule for common directives
import { RouterModule } from '@angular/router'; // Import RouterModule for navigation

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [],
  imports: [NavbarComponent, CommonModule, RouterModule],
})
export class HomeComponent implements OnInit {
  isLoggedIn: boolean = false;
  userName: string | null = null;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to the authentication status observable
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });

    // Subscribe to the current user observable to get the name
    this.authService.currentUser$.subscribe((user) => {
      this.userName = user ? user.name : null;
    });
  }
}
