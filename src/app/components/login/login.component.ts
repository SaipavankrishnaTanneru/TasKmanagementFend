import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-login',
  standalone: true, // Required for Angular 17+ when using imports in the component
  imports: [FormsModule, CommonModule,RouterLink], // Add CommonModule for common directives
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
loginWithOutlook() {
throw new Error('Method not implemented.');
}
loginWithGoogle() {
throw new Error('Method not implemented.');
}
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private apiService: ApiService, private router: Router) {}
  

  loginUser() {
    // Validate inputs
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password.';
      return;
    }

    // Create payload
    const user = { username: this.username, password: this.password };
    console.log('Login Payload:', user);

    // Call the API service
    this.apiService.loginUser(this.username, this.password).subscribe({
      next: (response: any) => {
        console.log('Login Response:', response);

        // Check if the response is valid
        if (response && response.id) {
          // Save user details to localStorage
          localStorage.setItem('userId', response.id.toString());
          localStorage.setItem('role', response.role);
          localStorage.setItem('username', response.username);

          // Redirect based on user role
          if (response.role === 'ADMIN') {
            this.router.navigate(['/admin-dashboard']);
          } else {
            this.router.navigate(['/user-dashboard']);
          }
        } else {
          console.error('Invalid login response, missing user ID.');
          this.errorMessage = 'Invalid login response. Please try again.';
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.errorMessage = 'Login failed. Please check your credentials and try again.';
      },
    });
  }
}