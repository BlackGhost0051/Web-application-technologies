import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  standalone: true,
  styleUrls: ['./change-password.component.css'],
  imports: [
    FormsModule,
    CommonModule,
  ],
  providers: [DataService, AuthService],
})
export class ChangePasswordComponent {
  login: string = '';
  currentPassword: string = '';
  newPassword: string = '';
  message: string = '';
  messageType: string = '';

  constructor(private dataService: DataService) {}

  onSubmit() {
    if (this.login && this.currentPassword && this.newPassword) {
      this.dataService.changePassword(this.login, this.currentPassword, this.newPassword).subscribe({
        next: (response) => {
          this.message = 'Password changed successfully!';
          this.messageType = 'success';
        },
        error: (err) => {
          this.message = `Error: ${err.error.error}`;
          this.messageType = 'error';
        }
      });
    }
  }
}
