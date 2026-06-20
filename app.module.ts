// Path: frontend/src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // For forms (template-driven and reactive)
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; // For making HTTP requests

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthInterceptor } from './interceptors/auth.interceptor'; // Import the interceptor

@NgModule({
  // Modules whose exported classes are available to component templates in this module
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, // For ngModel (template-driven forms)
    ReactiveFormsModule, // For FormGroup, FormControl (reactive forms)
    HttpClientModule, // For HttpClient service
    AppComponent, // Import the standalone AppComponent
    LoginComponent,
    RegisterComponent,
    TaskListComponent,
    TaskFormComponent,
    NavbarComponent,
    HomeComponent,
  ],
  providers: [
    // Provide the AuthInterceptor to intercept HTTP requests and add JWT token
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true, // multi: true means this is one of potentially many interceptors
    },
  ],
})
export class AppModule {}
