import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private comments: { postId: string; text: string }[] = [];

  constructor() {}

  getComments(postId: string): { postId: string; text: string }[] {
    return this.comments.filter(comment => comment.postId === postId);
  }

  addComment(postId: string, text: string) {
    this.comments.push({ postId, text });
  }
}
