import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {map, startWith, Observable, async} from 'rxjs';
import {ICatch, IProperty} from '../../interface';
import {PropertyService} from '../property/property.service';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {CatchService} from './catch.service';
import {Router} from '@angular/router';
import {MatCardModule, MatCardSubtitle} from '@angular/material/card';

@Component({
  selector: 'app-catch',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    NgIf,
    MatCardModule,
    MatError,
    MatLabel,
    MatButton,
    AsyncPipe,
    NgForOf,
  ],
  templateUrl: './catch.component.html',
  styleUrl: './catch.component.css'
})
export class CatchComponent {
  catchForm: FormGroup;
  properties: IProperty[] = [];
  filteredProperties!: Observable<IProperty[]>;
  errorMessage: string = '';
  successMessage: string = '';

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
    });
  }

  ngOnInit(): void {
    this.propertyService.getAllProperties().subscribe((properties) => {
      this.properties = properties;

      this.filteredProperties = this.catchForm.get('property')!.valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value.fullAddress)),
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
      const payload = {
        property: {
          id: formValue.property.id,
        },
        vehicle: {
          numberPlate: formValue.numberPlate,
          model: formValue.model,
          color: formValue.color
        }
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
