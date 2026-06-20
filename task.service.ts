// Path: frontend/src/app/services/task.service.ts
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment'; // Import environment variables

// Define the Task interface for type safety
export interface Task {
  _id?: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate?: Date;
  createdAt?: Date;
  user?: string; // The user ID who owns the task
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = `${environment.backendUrl}/api/tasks`; // Base URL for tasks API

  constructor(private http: HttpClient) {}

  // Helper method to get authorization headers (JWT token)
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Get token from local storage
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Attach JWT token
    });
  }

  // Fetch all tasks for the authenticated user
  getTasks(): Observable<Task[]> {
    return this.http
      .get<Task[]>(this.apiUrl, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Fetch a single task by ID
  getTaskById(id: string): Observable<Task> {
    return this.http
      .get<Task>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Create a new task
  createTask(task: Task): Observable<Task> {
    return this.http
      .post<Task>(this.apiUrl, task, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Update an existing task
  updateTask(id: string, task: Task): Observable<Task> {
    return this.http
      .put<Task>(`${this.apiUrl}/${id}`, task, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  // Delete a task
  deleteTask(id: string): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Generic error handler for HTTP requests
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${
        error.error?.message || error.statusText
      }`;
    }
    console.error(errorMessage);
    return throwError(() => error); // Re-throw the error for components to handle
  }
}
