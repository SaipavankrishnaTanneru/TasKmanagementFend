import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-post-task',
  imports: [FormsModule,CommonModule],
  templateUrl: './post-task.component.html',
  styleUrls: ['./post-task.component.css']
})
export class PostTaskComponent implements OnInit {
  task = { title: '', description: '', assignedUserId: '', status: 'Pending',startDate:'',dueDate:''};
  users: any[] = [];

  @Output() taskPosted = new EventEmitter<void>(); // Notify parent after updating the task
  @Output() cancelPost = new EventEmitter<void>(); // Notify parent when cancel is clicked
  @Output() closePostModal = new EventEmitter<void>(); // Notify parent to close the modal

  constructor(private apiService: ApiService) {}

   ngOnInit() {
    // Call the backend to fetch all users
     this.loadUsers();
  }

  // async loadUsers() {
  //   try {
  //     // Call the 'getAllUsers' API to fetch the list of users
  //     const response = await this.apiService.getAllUsers().toPromise();
  //     this.users = response.data; // Assuming 'data' contains the list of users
  //   } catch (error) {
  //     console.error("Error fetching users:", error);
  //   }
  // }

  loadUsers(): void {
    this.apiService.getAllUsers().subscribe({
      next: (response: any) => {
        // Filter users with the "USER" role and store both id and username
        this.users = response
          .filter((user: any) => user.role === "USER")
          .map((user: any) => ({
            id: user.id,
            name: user.username
          }));
  
        console.log("Loaded users:", this.users); // Debugging
      },
      error: (error) => {
        console.error("Error fetching users:", error);
      }
    });
  }
  
  
  postTask() {
    const taskData = {
      title: this.task.title,
      description: this.task.description,
      status: this.task.status,
      assignedUser: { id: this.task.assignedUserId } ,// Ensure it matches the backend field
      startDate: formatDate(this.task.startDate, 'dd/MM/yyyy', 'en-US'),// Format date
      dueDate: formatDate(this.task.dueDate, 'dd/MM/yyyy', 'en-US')
    };
  
    console.log("Task data to send:", taskData); // Debugging
  
    this.apiService.postTask(taskData).subscribe(
      (response) => {
        alert("Task posted successfully");
        console.log("Task created successfully:", response);
      },
      (error) => {
        console.error("Error creating task:", error);
      }
    );
  }
  
  cancelTask() {
    // Reset the form
    this.task = { title: '', description: '', assignedUserId: '', status: 'Pending',startDate:'',dueDate:'' };
    this.cancelPost.emit();
  }
  closeModal() {
    this.task = { title: '', description: '', assignedUserId: '', status: 'Pending',startDate:'',dueDate:'' };
    this.cancelPost.emit(); // Notify parent to just close modal
  }
  closeTaskModal(){
    this.closePostModal.emit();
  }
}