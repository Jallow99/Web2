// Path: frontend/src/app/components/task-list/task-list.component.ts
import { Component, OnInit } from '@angular/core';
import { TaskService, type Task } from '../../service/task.service'; // Import Task Service
import { Router } from '@angular/router'; // Import Router for navigation
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component'; // Import CommonModule for common directives

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: [], // No specific styles for task list component
  imports: [CommonModule, NavbarComponent, RouterModule], // Import CommonModule and NavbarComponent for common directives and navigation
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = []; // Array to hold fetched tasks
  isLoading: boolean = false; // To show loading state
  errorMessage: string = ''; // To display error messages

  constructor(
    private taskService: TaskService, // Inject Task Service
    private router: Router // Inject Router
  ) {}

  ngOnInit(): void {
    this.getTasks(); // Fetch tasks when the component initializes
  }

  getTasks(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        // Convert createdAt to Date and sort tasks by creation date, newest first
        this.tasks = tasks
          .map((task) => ({
            ...task,
            createdAt: task.createdAt ? new Date(task.createdAt) : undefined,
          }))
          .sort(
            (a, b) =>
              (a.createdAt ? new Date(b.createdAt as Date).getTime() : 0) -
              (b.createdAt ? new Date(a.createdAt as Date).getTime() : 0)
          );
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to fetch tasks.';
        console.error('Error fetching tasks:', err);
        // Handle token expiration or unauthorized access
        if (err.status === 401 || err.status === 403) {
          // You might want to redirect to login or clear local storage here
          console.warn(
            'Unauthorized access or token expired. Redirecting to login.'
          );
          this.router.navigate(['/login']);
        }
      },
    });
  }

  // Navigate to task form for editing
  editTask(id: string): void {
    this.router.navigate(['/tasks/edit', id]);
  }

  // Delete a task
  deleteTask(id: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          // Remove the deleted task from the local array
          this.tasks = this.tasks.filter((task) => task._id !== id);
          console.log('Task deleted successfully');
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = err.error?.message || 'Failed to delete task.';
          console.error('Error deleting task:', err);
        },
      });
    }
  }

  // Helper to format date for display
  formatDate(date?: Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }

  // Helper to get Bootstrap badge class based on status
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'bg-warning text-dark';
      case 'in-progress':
        return 'bg-info text-dark';
      case 'completed':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }
}
