import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private url = 'http://localhost:3100';

  constructor(private http: HttpClient) {
  }

  public getAll() {
    //return this.http.get(this.url + '/api/posts');
    return this.http.get(this.url + '/api/posts');
  }

  getById(id: string) {
    return this.http.get<any[]>(`${this.url}/api/post/${id}`).pipe(
      map((posts) => posts[0])
    );
  }

  addPost(postData: any) {
    return this.http.post(`${this.url}/api/post`, postData).subscribe({
      next: (response) => console.log('Post added successfully:', response),
      error: (err) => console.error('Error adding post:', err),
    });
  }

  changePassword(login: string, currentPassword: string, newPassword: string) {
    const body = {
      login: login,
      password: currentPassword,
      newPassword: newPassword
    };
    return this.http.patch(`${this.url}/api/user/change-password`, body);
  }
}
