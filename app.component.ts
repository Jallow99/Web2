// Path: frontend/src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { HomeComponent } from "./components/home/home.component";

@Component({
  selector: 'app-root', // The custom HTML tag used to insert this component
  standalone: true, // Indicates that this component is a standalone component
  templateUrl: './app.component.html', // Points to the component's HTML template
  imports: [RouterOutlet],
  styleUrls: [], // Can list component-specific CSS files here, or keep empty if global styles are used
})
export class AppComponent {
  title = 'Task Manager (MEAN Stack)'; // A property that can be used in the template
}
