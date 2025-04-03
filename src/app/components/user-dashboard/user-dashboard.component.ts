import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-dashboard',
  imports: [FormsModule,CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  tasks: any[] = [];
  userId: number = Number(localStorage.getItem('userId')); // Get user ID from local storage and convert to number
  user: any = {};
  isLoading = false;
  errorMessage = '';
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadTasks();
    this.loadUserDetails();
  }

  loadUserDetails() {
    this.apiService.getUserById(this.userId).subscribe(
      (response: any) => {
        console.log('User details received:', response);
        this.user = response;
      },
      (error) => {
        console.error('Error fetching user details:', error);
      }
    );
  }

  loadTasks() {
    const userId = localStorage.getItem("userId");
  
    if (!userId) {
      console.error("User ID is missing"); // Debugging log
      return;
    }
  
    const numericUserId = Number(userId); // Convert string to number
    const deletedTaskIds = JSON.parse(localStorage.getItem('deletedTaskIds') || '[]'); // Retrieve deleted task IDs
  
    this.apiService.getUserTasks(numericUserId).subscribe(
      (response: any) => {
        console.log("User Tasks received:", response);
        // Filter out the tasks that are marked as deleted
        this.tasks = response.filter((task: any) => !deletedTaskIds.includes(task.id));
      },
      (error) => {
        console.error("Error fetching user tasks:", error);
      }
    );
  }
  
  
  sendComment(task: any) {
    if (!task.newComment || task.newComment.trim() === '') {
      console.error("Comment cannot be empty");
      return;
    }
  
    const commentData = { message: task.newComment }; // Use 'message' instead of 'text'
  
    this.apiService.postComment(task.id, commentData).subscribe({
      next: (response) => {
        console.log('Comment sent successfully', response);
  
        // Ensure task.comments array exists
        if (!task.comments) {
          task.comments = [];
        }
  
        // Add the new comment to the task's comment list
        task.comments.push(response); // Use the response from the backend
  
        // Clear the input field
        task.newComment = '';
      },
      error: (error) => {
        console.error('Error sending comment:', error);
      }
    });
  }
  
  updateStatus(task: any) {
    console.log('Status updated for task:', task);
    // Here, call your API to update the status
    this.apiService.updateTask(task).subscribe(
      (response) => {
        console.log('Task updated successfully:', response);
      },
      (error) => {
        console.error('Error updating task:', error);
      }
    );
  }

  // Get gender-based profile picture
  getUserImage(): string {
    switch (this.user.gender?.toLowerCase()) {
      case 'male':
        return 'assets/images/userimage.avif';
      case 'female':
        return 'assets/images/female.avif';
      default:
        return 'assets/images/images1.jpg';
    }
  }

  toggleComments(task: any) {
    task.showComments = !task.showComments;
  }
  
  
}