import { Component } from '@angular/core';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [ RouterModule ],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
