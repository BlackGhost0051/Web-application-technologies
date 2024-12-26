import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsService } from '../../services/comments.service';
import {FormsModule} from '@angular/forms';


@Component({
  selector: 'comments-section',
  templateUrl: './comments-section.component.html',
  standalone: true,
  imports: [ FormsModule, CommonModule],
  styleUrl: './comments-section.component.css'
})

export class CommentsSectionComponent implements OnInit {
  @Input() postId!: string;
  comments: { postId: string; text: string }[] = [];
  newComment: string = '';

  constructor(private commentsService: CommentsService) {}

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.comments = this.commentsService.getComments(this.postId);
  }

  addComment() {
    if (this.newComment.trim()) {
      this.commentsService.addComment(this.postId, this.newComment.trim());
      this.newComment = '';
      this.loadComments();
    }
  }
}
