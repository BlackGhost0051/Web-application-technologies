import { Routes } from '@angular/router';
import {BlogComponent} from './components/blog/blog.component';
import {BlogItemDetailsComponent} from './components/blog-item-details/blog-item-details.component';
import {BlogHomeComponent} from './components/blog-home/blog-home.component';
import {HomeComponent} from './components/home/home.component';
import {authGuard} from './services/auth.guard';
import {LoginComponent} from './components/login/login.component';
import {SignupComponent} from './components/signup/signup.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'blog',
    loadComponent: () => import('./components/blog-home/blog-home.component').then(m => m.BlogHomeComponent),
    canActivate: [authGuard]
  },
  {
    path: 'blog/detail/:id',
    loadComponent: () => import('./components/blog-item-details/blog-item-details.component').then(m => m.BlogItemDetailsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./components/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'addPost',
    loadComponent: () => import('./components/add-post/add-post.component').then(m => m.AddPostComponent),
    canActivate: [authGuard]
  },
  {
    path: 'changePassword',
    loadComponent: () => import('./components/change-password/change-password.component').then(m => m.ChangePasswordComponent),
    canActivate: [authGuard],
  }
];
