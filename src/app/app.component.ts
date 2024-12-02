import {Component} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {NavbarComponent} from './components/navbar/navbar.component';


@Component({
  selector: 'app-root',
  imports: [RouterModule, CommonModule, NavbarComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'RFM';
}
