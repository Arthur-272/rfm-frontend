import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {ICatch, IRelease} from '../../interface';
import {ApplicationConfigService} from '../../config/application-config-service';

interface IReportData {
  catches: ICatch[];
  releases: IRelease[];
}

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private apiURL = ''; // Replace with your API URL

  constructor(private http: HttpClient, private appConfigService: ApplicationConfigService) {
    this.apiURL = this.appConfigService.getResourceURL();
  }

  getReportDataForUser(): Observable<IReportData> {
    const payload = {
      'date': new Date().toISOString()
    }
    return this.http.post<IReportData>(`${this.apiURL}/report/user`, payload);
  }

  getReportData(): Observable<ICatch[]> {
    const payload = {
      'date': new Date().toISOString()
    }
    return this.http.post<ICatch[]>(`${this.apiURL}/report/rfm`, payload);
  }
}
