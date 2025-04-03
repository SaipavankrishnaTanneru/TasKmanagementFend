import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterLink,FormsModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title="task"
  isLoggedIn: boolean = false;
  currentRoute: string = '/';


  constructor(private authService: AuthService, private router:Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url; // Capture the current route
      }
    });
  }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status; // Update isLoggedIn when login state changes
    });
  }
  

  isLogout() {
   
    localStorage.removeItem('userId');
    // localStorage.removeItem('role');
    // localStorage.removeItem('username');
    // localStorage.removeItem('contact');
  
    this.authService.setLoginStatus(false);
    console.log("logout")
    this.router.navigateByUrl("/login") // Add this line
  }
  
}