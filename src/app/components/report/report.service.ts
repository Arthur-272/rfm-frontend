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
  private apiURL;

  constructor(private http: HttpClient, private appConfigService: ApplicationConfigService) {
    this.apiURL = this.appConfigService.getResourceURL();
  }

  getReportDataForUser(date: string): Observable<ICatch[]> {
    const payload = {
      'date': date
    }
    return this.http.post<ICatch[]>(`${this.apiURL}/report/user`, payload);
  }

  getReportData(date: string): Observable<ICatch[]> {
    const payload = {
      'date': date
    }
    return this.http.post<ICatch[]>(`${this.apiURL}/report/rfm`, payload);
  }
}
