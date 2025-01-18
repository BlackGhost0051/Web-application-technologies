import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'add-post',
  imports: [FormsModule, CommonModule],
  providers: [AuthService],
  templateUrl: './add-post.component.html',
  standalone: true,
  styleUrl: './add-post.component.css'
})
export class AddPostComponent {
  constructor(private dataService: DataService) {}

  onSubmit(form: any) {
    if (form.valid) {
      const newPost = {
        title: form.value.title,
        text: form.value.text,
        image: form.value.image || 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F021%2F548%2F095%2Foriginal%2Fdefault-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg&f=1&nofb=1&ipt=b948c7f1c77faadf5177ea05d18abd9f27579b89b4444533014c01182e4cb7d5&ipo=images',
      };
      this.dataService.addPost(newPost);
      form.reset();
    }
  }
}
