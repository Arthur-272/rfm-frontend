import {ApplicationConfig, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApplicationConfigService} from '../../config/application-config-service';
import {ICatch, IProperty, IVehicle} from '../../interface';
import {Observable} from 'rxjs';
import {constants} from 'node:fs';

@Injectable({
  providedIn: 'root'
})
export class CatchService {

  private apiURL: string;
  constructor(private http: HttpClient, private apiConfigService: ApplicationConfigService) {
    this.apiURL = apiConfigService.getResourceURL();
  }

  catchVehicle(catchInfo: any): Observable<any> {
    return this.http.post<ICatch>(`${this.apiURL}/catch-release/catch`, catchInfo);
  }

  liveCatches():Observable<ICatch[]> {
    return this.http.get<ICatch[]>(`${this.apiURL}/catch-release/live`);
  }

  releaseVehicle(releaseInfo: {property: IProperty; vehicle: IVehicle}):Observable<any> {
    return this.http.post(`${this.apiURL}/catch-release/release`, releaseInfo);

  }

  removeCatch(catchInfo: ICatch) {
    return this.http.post(`${this.apiURL}/catch-release/remove`, catchInfo);
  }
}
