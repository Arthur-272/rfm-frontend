import { Component } from '@angular/core';
import {IProperty} from '../../../interface';
import {PropertyService} from '../property.service';
import {FormsModule} from '@angular/forms';
import {response} from 'express';

@Component({
  selector: 'app-create',
  imports: [
    FormsModule
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreatePropertyComponent {

  property: IProperty = {
    id: '',
    name: '',
    address: {
      id: '',
      fullAddress: '',
      streetAddress: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    authorizedVehicles: []
  }

  constructor(private service: PropertyService) {}

  onSubmit() {
    console.log(this.property);
    this.property.address.fullAddress = this.property.address.streetAddress + ', ' + this.property.address.city + ', ' + this.property.address.state + ', ' + this.property.address.postalCode + ', ' + this.property.address.country;
    this.service.createProperty(this.property).subscribe({
      next: (response) => {
        window.alert("Property Created Successfully");

      },
      error: (error) => {
        window.alert("Error Creating Property");
      }
    });
  }
}