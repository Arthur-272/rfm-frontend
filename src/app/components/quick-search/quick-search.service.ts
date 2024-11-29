import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ApplicationConfigService} from '../../config/application-config-service';

@Injectable({
  providedIn: 'root'
})
export class Service {
  private apiURL: string;

  constructor(
    private http : HttpClient,
    configService : ApplicationConfigService
  ) {
    this.apiURL = configService.getResourceURL();
  }

  searchVehicle(plate: string): any {
    const params = new HttpParams().set('plate', plate);
    return this.http.get(`${this.apiURL}/vehicle/get`, { params });
  }
}
