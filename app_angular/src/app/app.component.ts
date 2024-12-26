import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {BlogComponent} from './components/blog/blog.component';
import {AddPostComponent} from './components/add-post/add-post.component';
import {GalleryComponent} from './components/gallery/gallery.component';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BlogComponent, AddPostComponent, GalleryComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  public posts: any[] = [];
  constructor(private dataService: DataService) {
    this.posts = this.dataService.getAll();
  }


  public counter: number = 0;

  add() {
    this.counter++;
  }

  remove() {
    this.counter--;
  }
}

