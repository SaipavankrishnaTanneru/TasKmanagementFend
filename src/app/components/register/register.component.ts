import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true, // Required for Angular 17+ when using imports in the component
  imports: [FormsModule, CommonModule, RouterLink], // Add CommonModule for common directives
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  user: any = {
    username: '',
    email: '',
    password: '',
    role: 'USER',
  };
  errorMessage: string = ''; // To show error messages

  constructor(private apiService: ApiService, private router: Router) {}

  registerUser() {
    // Validate inputs
    if (!this.user.username || !this.user.email || !this.user.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    // Call the API service
    this.apiService.registerUser(this.user).subscribe({
      next: (response: any) => {
        console.log('User registered successfully', response);
        // Navigate to login page after successful registration
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error registering user:', error);
        this.errorMessage = 'Registration failed. Please try again later.';
      },
    });
  }
}