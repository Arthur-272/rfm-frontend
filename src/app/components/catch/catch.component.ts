// catch.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {map, startWith, Observable, async} from 'rxjs';
import { ICatch, IProperty } from '../../interface';
import { PropertyService } from '../property/property.service';
import { CatchService } from './catch.service';
import { Router } from '@angular/router';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // For date adapter

// Additional Imports
import {NgIf, NgForOf, AsyncPipe} from '@angular/common';
import { MatError } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-catch',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgIf,
    NgForOf,
    MatError,
    MatLabel,
    MatAutocompleteTrigger,
    AsyncPipe
  ],
  templateUrl: './catch.component.html',
  styleUrls: ['./catch.component.css']
})
export class CatchComponent implements OnInit {
  catchForm: FormGroup;
  properties: IProperty[] = [];
  filteredProperties!: Observable<IProperty[]>;
  errorMessage: string = '';
  successMessage: string = '';

  today: Date = new Date();
  // New Property for Selected Date
  selectedDate: Date | null = null;

  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private catchService: CatchService,
    private router: Router
  ) {
    this.catchForm = this.fb.group({
      property: ['', Validators.required],
      numberPlate: ['', Validators.required],
      model: ['', Validators.required],
      color: ['', Validators.required],
      date: [null] // New Form Control for Date (Optional)
    });
  }

  ngOnInit(): void {
    this.propertyService.getAllProperties().subscribe((properties) => {
      this.properties = properties;

      this.filteredProperties = this.catchForm.get('property')!.valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value.address.fullAddress)),
        map((fullAddress) => (fullAddress ? this._filterProperties(fullAddress) : this.properties.slice()))
      );
    });
  }

  displayProperty(property: IProperty): string {
    return property && property.address.fullAddress ? property.address.fullAddress : '';
  }

  private _filterProperties(fullAddress: string): IProperty[] {
    const filterValue = fullAddress.toLowerCase();

    return this.properties.filter((property) =>
      property.address.fullAddress.toLowerCase().includes(filterValue)
    );
  }

  onSubmit() {
    if (this.catchForm.valid) {
      const formValue = this.catchForm.value;

      // Prepare the payload
      const payload = {
        property: {
          id: formValue.property.id,
        },
        vehicle: {
          numberPlate: formValue.numberPlate,
          model: formValue.model,
          color: formValue.color
        },
        timestamp: formValue.date ? formValue.date.toISOString() : new Date().toISOString() // Use selected date or current date/time
      }

      console.log(payload);

      this.catchService.catchVehicle(payload).subscribe({
        next: data => {
          this.successMessage = "Caught Successfully";
          this.router.navigate(['/catch/live'])
        },
        error: error => {
          this.errorMessage = error.error.split(":")[1];
        }
      })
    }
  }

  protected readonly async = async;
}
