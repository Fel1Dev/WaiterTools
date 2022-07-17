import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DeliveryDataService {
  constructor(private http: HttpClient) {}

  getCallcenterReport(selectedDate: string, restaurantId: string) {
    const callcenterUrl = `${environment.BASE_URL}${environment.CALLCENTER_PATH}`;
    const startTime = moment(selectedDate).unix() * 1000;
    const endTime = moment(selectedDate).add(1, 'day').unix() * 1000;
    console.log('path:' + callcenterUrl);
    console.log('restaurantId:' + restaurantId);
    console.log('startTime:' + startTime);
    console.log('endTime:' + endTime);

    let queryParams: HttpParams = new HttpParams().appendAll({
      restaurantId: restaurantId,
      startTime: startTime,
      endTime: endTime,
      requestType: false,
    });
    
    return this.http.get<any>(callcenterUrl, { params: queryParams });
  }
}
