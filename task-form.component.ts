// Path: frontend/src/app/components/task-form/task-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; // For getting route params and navigation
import { TaskService } from '../../service/task.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // For common directives
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from "../navbar/navbar.component";

interface Task {
  _id?: string; // Optional for new tasks
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate?: Date;
  createdAt?: Date; // Optional for update
}

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NavbarComponent], // Import CommonModule for common directives and FormsModule for form handling
  styleUrls: [], // No specific styles for task form component
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup;
  taskId: string | null = null; // To hold task ID if in edit mode
  isEditMode: boolean = false; // Flag to determine if it's edit or create
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute, // To get URL parameters
    private router: Router, // To navigate after form submission
    private taskService: TaskService // Task service for API calls
  ) {}

  ngOnInit(): void {
    // Initialize the form with empty values and validators
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      status: ['pending', Validators.required], // Default status
      dueDate: [''], // Date input can be empty
    });

    // Check if we are in edit mode by looking for an 'id' in the route params
    this.route.paramMap.subscribe((params) => {
      this.taskId = params.get('id');
      if (this.taskId) {
        this.isEditMode = true;
        this.loadTask(this.taskId); // Load task data if in edit mode
      }
    });
  }

  // Load task data when in edit mode
  loadTask(id: string): void {
    this.taskService.getTaskById(id).subscribe({
      next: (task: Task) => {
        // Populate the form with task data
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          status: task.status,
          // Format date to 'YYYY-MM-DD' for date input field
          dueDate: task.dueDate
            ? new Date(task.dueDate).toISOString().substring(0, 10)
            : '',
        });
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error?.message || 'Failed to load task.';
        console.error('Error loading task:', err);
        // Redirect if task not found or unauthorized
        if (err.status === 404 || err.status === 401 || err.status === 403) {
          this.router.navigate(['/tasks']);
        }
      },
    });
  }

  // Getter for easy access to form fields in the template
  get f() {
    return this.taskForm.controls;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const taskData: Task = this.taskForm.value;

    if (this.isEditMode && this.taskId) {
      // Update existing task
      this.taskService.updateTask(this.taskId, taskData).subscribe({
        next: () => {
          this.successMessage = 'Task updated successfully!';
          setTimeout(() => this.router.navigate(['/tasks']), 1500); // Redirect after a short delay
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = err.error?.message || 'Failed to update task.';
          console.error('Error updating task:', err);
        },
      });
    } else {
      // Create new task
      this.taskService.createTask(taskData).subscribe({
        next: () => {
          this.successMessage = 'Task created successfully!';
          setTimeout(() => this.router.navigate(['/tasks']), 1500); // Redirect after a short delay
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = err.error?.message || 'Failed to create task.';
          console.error('Error creating task:', err);
        },
      });
    }
  }

  public goToTasks(): void {
    this.router.navigate(['/tasks']);
  }
}
