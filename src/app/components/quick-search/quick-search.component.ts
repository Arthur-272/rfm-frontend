import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Service } from './quick-search.service';
import { NgForOf, NgIf } from '@angular/common';
import { IProperty, IVehicle } from '../../interface';

@Component({
  selector: 'app-quick-search',
  standalone: true,
  imports: [FormsModule, NgIf, NgForOf],
  templateUrl: './quick-search.component.html',
  styleUrls: ['./quick-search.component.css'],
})
export class QuickSearchComponent {
  numberPlate: string = '';
  vehicle: IVehicle | null = null;
  properties: IProperty[] = [];
  errorMessage: string = '';

  constructor(private service: Service) {}

  transformNumberPlate(value: string) {
    // Convert to uppercase and remove spaces
    this.numberPlate = value ? value.toUpperCase().replace(/\s/g, '') : '';
  }

  onSearch() {
    this.vehicle = null; // Reset previous data
    this.errorMessage = '';

    // Proceed only if the form is valid. Template-driven forms will have already validated pattern & required.
    this.service.searchVehicle(this.numberPlate).subscribe({
      next: (response: any) => {
        this.vehicle = response.vehicle;
        this.properties = response.properties;
      },
      error: () => {
        this.errorMessage = 'Vehicle Not Found';
      },
    });
  }
}
