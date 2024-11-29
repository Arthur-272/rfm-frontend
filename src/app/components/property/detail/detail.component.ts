import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import {IProperty, IVehicle} from '../../../interface';
import {FormsModule} from '@angular/forms';
import {PropertyService} from '../property.service';

@Component({
  selector: 'app-detail',
  imports: [
    NgIf,
    NgForOf,
    FormsModule
  ],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailPropertyComponent implements OnInit{
  property: IProperty | null = null;
  filteredVehicles: IVehicle[] = [];
  searchQuery: string = '';
  vehicle: IVehicle | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private propertyService: PropertyService) {}

  ngOnInit() {
    this.refreshProperty();
  }

  filterVehicle() {
    if (this.searchQuery.trim() === '') {
      // Show all vehicles if the search query is empty
      this.filteredVehicles = this.property?.authorizedVehicles || [];
    } else {
      // Filter the vehicles based on the search query
      this.filteredVehicles = this.property?.authorizedVehicles?.filter((vehicle) =>
        vehicle.numberPlate.toLowerCase().includes(this.searchQuery.toLowerCase())
      ) || [];
    }

  }

  refreshProperty() {
    this.propertyService.getPropertyById(history.state.property?.id || '').subscribe({
      next: (response) => {
        this.property = response;
        this.filteredVehicles = this.property?.authorizedVehicles || [];
      },
      error: (error) => {
        window.alert("Error Getting Property");
      }
    })
  }

  addVehicleToProperty() {
    this.router.navigate(['/property/update'], {state: {property: this.property}});
  }



}
