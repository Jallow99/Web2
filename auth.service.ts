// Path: frontend/src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User } from '../models/user.model'; // Import the User interface
import { environment } from '../../environments/environment'; // Import environment variables

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.backendUrl}/api/auth`; // Base URL for authentication API

  // BehaviorSubject to track authentication status and current user
  private _isLoggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this._isLoggedIn.asObservable(); // Public observable for components

  private _currentUser = new BehaviorSubject<User | null>(
    this.getCurrentUserFromLocalStorage()
  );
  currentUser$ = this._currentUser.asObservable(); // Public observable for current user

  constructor(private http: HttpClient) {}

  // Check if a token exists in local storage
  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  // Get current user from local storage
  private getCurrentUserFromLocalStorage(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Set authentication data in local storage and update subjects
  private setAuthData(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this._isLoggedIn.next(true);
    this._currentUser.next(user);
  }

  // Get the JWT token from local storage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Register a new user
  register(name: string, email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/register`, { name, email, password })
      .pipe(
        tap((response) => {
          // On successful registration, save token and user data
          this.setAuthData(response.token, {
            _id: response._id,
            name: response.name,
            email: response.email,
          });
        }),
        catchError(this.handleError) // Handle HTTP errors
      );
  }

  // User login
  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response) => {
          // On successful login, save token and user data
          this.setAuthData(response.token, {
            _id: response._id,
            name: response.name,
            email: response.email,
          });
        }),
        catchError(this.handleError) // Handle HTTP errors
      );
  }

  // User logout
  logout(): void {
    localStorage.removeItem('token'); // Remove token from local storage
    localStorage.removeItem('user'); // Remove user data from local storage
    this._isLoggedIn.next(false); // Update authentication status
    this._currentUser.next(null); // Clear current user
  }

  // Generic error handler for HTTP requests
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => error); // Re-throw the error for component to handle
  }
}
