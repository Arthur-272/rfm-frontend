import { Component } from '@angular/core';
import {QuickSearchComponent} from '../quick-search/quick-search.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    QuickSearchComponent,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
