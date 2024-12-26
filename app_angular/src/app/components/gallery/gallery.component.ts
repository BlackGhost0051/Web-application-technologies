import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'gallery',
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  standalone: true,
  styleUrl: './gallery.component.css'
})
export class GalleryComponent {
  @Input() posts: any[] = [];
  selectedImage: string | null = null;

  openModal(image: string) {
    this.selectedImage = image;
  }

  closeModal() {
    this.selectedImage = null;
  }
}
