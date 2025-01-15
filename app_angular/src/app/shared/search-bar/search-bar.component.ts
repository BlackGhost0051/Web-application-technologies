import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute} from '@angular/router';
import {TextFormatDirective} from '../../directives/text-format.directive';


@Component({
  selector: 'app-search-bar',
  imports: [ FormsModule , TextFormatDirective],
  templateUrl: './search-bar.component.html',
  standalone: true,
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent implements OnInit{
  public filterText: string = '';

  @Output() name = new EventEmitter<string>();

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.filterText = params['name'];
      this.sendFilter();
    });
  }

  sendFilter(): void {
    this.router.navigate(['/'], {queryParams: {
      name: this.filterText?.toLowerCase()
    }});

    this.name.emit(this.filterText);
  }
}
