import {Component, OnInit} from '@angular/core';
import {IProperty, IVehicle} from '../../../interface';
import {PropertyService} from '../../property/property.service';
import {FormsModule, NgForm} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create',
  imports: [
    FormsModule
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateVehicleComponent{

  vehicle: IVehicle | any;

  constructor(private service: PropertyService, private router: Router){
    this.vehicle = {
      numberPlate: '',
      model: '',
      color: ''
    }
  }

  onSubmit() {
    const payload = {
      vehicle: this.vehicle,
      property: {
        id: history.state.property.id
      }
    }
    this.service.addVehicleToProperty(payload).subscribe({
      next: (response) => {
        window.alert("Vehicle Added Successfully");
        this.router.navigate(['/property/detail'], {state: {property: history.state.property}});
      },
      error: (error) => {
        window.alert("Error Adding Vehicle");
      }
    })
  }

  onCancel(vehicleForm: NgForm) {
    this.router.navigate(['/property/detail'], {state: {property: history.state.property}});
  }
}
