import {Component, OnInit, ViewChild} from '@angular/core';
import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';
import { BlogComponent } from '../blog/blog.component';

@Component({
  selector: 'app-blog-home',
  imports: [ SearchBarComponent, BlogComponent ],
  templateUrl: './blog-home.component.html',
  standalone: true,
  styleUrl: './blog-home.component.css'
})
export class BlogHomeComponent implements OnInit{
  public filterText: string = '';

  @ViewChild(BlogComponent) blogComponent!: BlogComponent;

  constructor() {}

  ngOnInit(): void {
  }

  getName($event: string): void {
    this.filterText = $event;
    console.log(this.filterText)
  }

  refreshPosts(): void {
    if (this.blogComponent) {
      this.blogComponent.getAll();
    }
  }
}
