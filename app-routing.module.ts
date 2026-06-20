// Path: frontend/src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { AuthGuard } from './guards/auth.guard'; // Import the AuthGuard

// Define the application routes
const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' }, // Default route
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // Protected routes - only accessible if authenticated (using AuthGuard)
  { path: 'tasks', component: TaskListComponent, canActivate: [AuthGuard] },
  { path: 'tasks/new', component: TaskFormComponent, canActivate: [AuthGuard] },
  {
    path: 'tasks/edit/:id',
    component: TaskFormComponent,
    canActivate: [AuthGuard],
  },
  // Wildcard route for 404 (or redirect to home)
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // Configure the router at the application root level
  exports: [RouterModule], // Export RouterModule to make router directives available
})
export class AppRoutingModule {}
