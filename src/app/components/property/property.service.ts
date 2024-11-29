import { Injectable } from '@angular/core';
import { ApplicationConfigService } from '../../config/application-config-service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NgModel } from '@angular/forms';
import {IProperty, IVehicle} from '../../interface';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  private apiURL: string;

  constructor(
    private http : HttpClient,
    configService : ApplicationConfigService
  ) {
    this.apiURL = configService.getResourceURL();
  }

  getAllProperties(): Observable<any> {
    return this.http.get(`${this.apiURL}/property/get/all`);
  }

  createProperty(property: IProperty) : Observable<any> {
    return this.http.post(`${this.apiURL}/property/add`, property);
  }

  addVehicleToProperty(payload: any) : Observable<any> {
    return this.http.post(`${this.apiURL}/property/update`, payload);
  }



}
