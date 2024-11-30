import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {PropertyService} from '../property.service';
import {IProperty} from '../../../interface';

@Component({
  selector: 'list-properties',
  imports: [CommonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListPropertiesComponent implements OnInit{
  properties: IProperty[] = []
  constructor(private service: PropertyService, private router: Router) {

  }

  ngOnInit(): void {
    this.service.getAllProperties().subscribe((data : IProperty[]) => {
      this.properties = data
    })

  }

  goToDetail(property: IProperty) {
    this.router.navigate(['/property/detail'], {state: {property: property}});

  }

  addProperty() {
    this.router.navigate(['/property/create']);
  }

  deleteProperty(property: IProperty, event: Event) {
    // Prevent row click from triggering navigation
    event.stopPropagation();

    if (confirm(`Are you sure you want to delete the property "${property.name}"?`)) {
      this.service.deleteProperty(property.id).subscribe(() => {
        // Remove the deleted property from the list
        this.properties = this.properties.filter(p => p.id !== property.id);
      });
    }
  }

}
