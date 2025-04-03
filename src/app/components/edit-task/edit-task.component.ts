import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common'; // Import DatePipe for formatting

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css'],
  providers: [DatePipe], // Provide DatePipe for use in the component
})
export class EditTaskComponent implements OnInit {
  @Input() task: any; // Task passed from the parent component
  users: any[] = []; // List of users to assign to the task

  @Output() taskUpdated = new EventEmitter<void>(); // Notify parent after updating the task
  @Output() cancelEditTask = new EventEmitter<void>(); // Notify parent when cancel is clicked
  @Output() closeEditTaskModal = new EventEmitter<void>(); // Notify parent to close the modal

  constructor(private apiService: ApiService, private datePipe: DatePipe) {}

  ngOnInit() {
    // Initialize task with default values if not provided
    this.task = this.task || {
      title: '',
      description: '',
      status: 'Pending',
      assignedUser: null,
      startDate: this.formatDate(new Date().toISOString().split('T')[0]), // Default to today's date
      dueDate: this.formatDate(new Date().toISOString().split('T')[0]), // Default to today's date
    };

    // Load users on initialization
    this.loadUsers();

    // Set assignedUserId if the task has an assigned user
    if (this.task.assignedUser) {
      this.task.assignedUserId = this.task.assignedUser.id;
    }

    // Format startDate and dueDate to dd/MM/yyyy if they exist
    if (this.task.startDate) {
      this.task.startDate = this.formatDate(this.task.startDate);
    }
    if (this.task.dueDate) {
      this.task.dueDate = this.formatDate(this.task.dueDate);
    }
  }

  // Format date to dd/MM/yyyy
  formatDate(date: string): string {
    if (!date) return '';
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      console.error('Invalid date:', date);
      return '';
    }
    return this.datePipe.transform(parsedDate, 'dd/MM/yyyy') || '';
  }

  // Parse date from dd/MM/yyyy to YYYY-MM-DD for API
  parseDate(date: string): string {
    if (!date) return '';
    const [day, month, year] = date.split('/');
    const parsedDate = new Date(`${year}-${month}-${day}`);
    if (isNaN(parsedDate.getTime())) {
      console.error('Invalid date format:', date);
      return '';
    }
    return parsedDate.toISOString().split('T')[0]; // Return in YYYY-MM-DD format
  }

  // Load users from the API
  loadUsers() {
    this.apiService.getAllUsers().subscribe({
      next: (response: any) => {
        // Filter users with role "USER" and map to required format
        this.users = response
          .filter((user: any) => user.role === 'USER')
          .map((user: any) => ({
            id: user.id,
            name: user.username,
          }));

        console.log('Loaded users:', this.users); // Debugging
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
    });
  }

  // Update the task
  updateTask() {
    // Validate that startDate and dueDate are valid
    const startDate = this.parseDate(this.task.startDate);
    const dueDate = this.parseDate(this.task.dueDate);

    if (!startDate || !dueDate) {
      alert('Invalid date format. Please use dd/MM/yyyy.');
      return;
    }

    // Validate that dueDate is after startDate
    const startDateObj = new Date(startDate);
    const dueDateObj = new Date(dueDate);

    if (dueDateObj < startDateObj) {
      alert('Due Date must be after Start Date.');
      return;
    }

    const taskData = {
      id: this.task.id, // Ensure task ID is included
      title: this.task.title,
      description: this.task.description,
      status: this.task.status,
      assignedUser: { id: this.task.assignedUserId },
      startDate: startDate, // Use parsed startDate
      dueDate: dueDate, // Use parsed dueDate
    };

    console.log('Task data to update:', taskData); // Debugging

    this.apiService.updateTask(taskData).subscribe({
      next: () => {
        alert('Task updated successfully!');
        this.taskUpdated.emit(); // Notify parent to reload tasks
        this.closeModal(); // Close modal after update
      },
      error: (error) => {
        console.error('Error updating task:', error);
        alert('Error updating task.');
      },
    });
  }

  // Close the modal and reset the task
  cancelEdit() {
    // Reset the form and refresh the task list
    this.task = {
      title: '',
      description: '',
      assignedUserId: '',
      status: 'Pending',
      startDate: this.formatDate(new Date().toISOString().split('T')[0]), // Reset to today's date
      dueDate: this.formatDate(new Date().toISOString().split('T')[0]), // Reset to today's date
    };
    this.cancelEditTask.emit(); // Notify parent to refresh the list and close modal
  }

  // Close the modal
  closeModal() {
    this.closeEditTaskModal.emit(); // Notify parent to just close modal
  }
}