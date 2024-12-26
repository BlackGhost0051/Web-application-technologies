import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'add-post',
  imports: [FormsModule, CommonModule],
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
        image: form.value.image || 'https://via.placeholder.com/150',
        id: Date.now().toString()
      };
      this.dataService.addPost(newPost);
      form.reset();
    }
  }
}
