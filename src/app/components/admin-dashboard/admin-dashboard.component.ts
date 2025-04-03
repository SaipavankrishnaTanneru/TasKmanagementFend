import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { PostTaskComponent } from '../post-task/post-task.component';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  imports: [PostTaskComponent, EditTaskComponent,FormsModule,CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  tasks: any[] = [];
  searchTerm: string = '';
  showPostTask: boolean = false;
  selectedTask: any = null;
  selectedStatus: string = 'all';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadTasks();
  }

  // loadTasks() {
  //   this.apiService.getAllTasks().subscribe(
  //     (response: any) => {
  //       console.log("API Response:", response);
  //       this.tasks = response.data || response;  // Handle cases where response.data might not exist
  //       this.tasks.forEach(task => {
  //         if (!task.comments) {
  //           task.comments = [];
  //         }
  //         task.showComments = false; 
  //       });
  //     },
  //     (error) => {
  //       console.error("Error fetching tasks:", error);
  //     }
  //   );
  // }

  sendAdminReply(task: any) {
    if (!task.adminReply || task.adminReply.trim() === '') return;
  
    const adminId = this.apiService.getAdminUserId();
    
    // Create the object to send to backend
    const replyData = {
      message: task.adminReply,
      user: {  
        id: adminId,
        role: 'ADMIN',
        username: 'Admin' 
      }
    };
  
    this.apiService.postComment(task.id, replyData).subscribe({
      next: () => {
        // Create a new admin comment object without spreading response
        const adminComment = {
          message: task.adminReply, // Directly use the admin's reply
          user: {
            id: adminId,
            role: 'ADMIN',
            username: 'Admin'
          }
        };
        
        task.comments.push(adminComment);
        task.adminReply = '';
      },
      error: (err) => console.error('Error sending reply:', err)
    });
  }

  loadTasks() {
    this.apiService.getAllTasks().subscribe(
      (response: any) => {
        console.log("API Response:", response);
        this.tasks = response.data || response;  // Handle cases where response.data might not exist
        const deletedTaskIds = JSON.parse(localStorage.getItem('deletedTaskIds') || '[]');
  
        this.tasks.forEach(task => {
          if (!task.comments) {
            task.comments = [];
          }
          task.showComments = false; 
          task.deleted = deletedTaskIds.includes(task.id); // Check if task is marked as deleted
        });
      },
      (error) => {
        console.error("Error fetching tasks:", error);
      }
    );
  }
  
  

  get filteredTasks() {
    if (!this.tasks || !Array.isArray(this.tasks)) {
      return []; // Return an empty array if tasks is undefined/null
    }
  
    return this.tasks.filter(task => {
      const matchesSearch =
        task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        task.assignedUser?.username.toLowerCase().includes(this.searchTerm.toLowerCase()); // Check title or username
  
      const matchesStatus = this.selectedStatus === 'all' || task.status === this.selectedStatus;
      
      return matchesSearch && matchesStatus && !task.deleted;
    });  

    
  }
  
  
  

//   deleteTask(taskId: number) {
//     if (confirm("Are you sure you want to delete this task?")) {
//       try {
//         this.apiService.deleteTask(taskId).subscribe(); // Ensure API call completion
//         this.loadTasks(); // Reload tasks from backend after deletion
//       } catch (error) {
//         console.error("Error deleting task:", error);
//       }
//     }
// }
deleteTask(taskId: number) {
  if (confirm("Are you sure you want to delete this task?")) {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
    let deletedTaskIds = JSON.parse(localStorage.getItem('deletedTaskIds') || '[]');
    if (!deletedTaskIds.includes(taskId)) {
      deletedTaskIds.push(taskId);
    }
    localStorage.setItem('deletedTaskIds', JSON.stringify(deletedTaskIds));
  }
}

  openPostTaskModal() {
    this.showPostTask = true;
  }
  
  toggleTaskDetails(task: any) {
    task.showDetails = !task.showDetails;
  }

  closePostTaskModal() {
    this.showPostTask = false;
  }

  editTask(task: any) {
    this.selectedTask = { ...task }; // Copy task for editing
  }

  closeEditTaskModal() {
    this.selectedTask = null;
  }

  toggleComments(task: any) {
    task.showComments = !task.showComments;
  }

  
  onStatusFilterChange(status: string) {
    this.selectedStatus = status; // Update selected status
  }
}