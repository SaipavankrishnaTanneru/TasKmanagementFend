import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private backendUrl = 'http://localhost:8015'; // Your backend URL

  constructor(private http: HttpClient) {}

  // Register a new user
  registerUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.backendUrl}/auth/register`, user);
  }

  // Login a user
  loginUser(username: string, password: string): Observable<any> {
    const payload = { username, password };
    return this.http.post<any>(`${this.backendUrl}/auth/login`, payload);
  }

  // Get all tasks
  getAllTasks(): Observable<any> {
    return this.http.get<any>(`${this.backendUrl}/tasks/all`);
  }
  getAdminUserId(): number {
    const userId = localStorage.getItem('userId');
    return userId ? Number(userId) : 0;
  }

  // Get tasks for a specific user
  getUserTasks(userId: number): Observable<any> {
    return this.http.get<any>(`${this.backendUrl}/tasks/user/${userId}`);
  }

  // Create a new task
  postTask(task: any): Observable<any> {
    return this.http.post<any>(`${this.backendUrl}/tasks/create`, task);
  }

  // Update an existing task
  updateTask(task: any): Observable<any> {
    return this.http.put<any>(`${this.backendUrl}/tasks/update`, task);
  }

  // Delete a task
  deleteTask(taskId: number): Observable<any> {
    return this.http.delete<any>(`${this.backendUrl}/tasks/delete/${taskId}`);
  }

  // Post a comment for a task
  postComment(taskId: number, comment: { message: string }): Observable<any> {
    return this.http.post<any>(`${this.backendUrl}/comments/task/${taskId}`, comment);
  }

  // Get all comments
  getAllComments(): Observable<any> {
    return this.http.get<any>(`${this.backendUrl}/comments/all`);
  }

  // Get all users
  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.backendUrl}/auth/all`);
  }

  // Get user details by ID
  getUserDetails(userId: number): Observable<any> {
    return this.http.get<any>(`${this.backendUrl}/user/${userId}`);
  }

  // Get user by ID (added to fix the error)
  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.backendUrl}/auth/getById/${userId}`);
  }

  // Update task status
  updateTaskStatus(taskId: number, status: string): Observable<any> {
    return this.http.put<any>(`${this.backendUrl}/tasks/update-status/${taskId}`, { status });
  }
}