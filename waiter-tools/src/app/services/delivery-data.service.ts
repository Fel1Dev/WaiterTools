import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DeliveryDataService {
  constructor(private http: HttpClient) {}

  getCallcenterReport(selectedDate: string, restaurantId: string) {
    const callcenterUrl = `${environment.BASE_URL}${environment.CALLCENTER_PATH}`;

    const startTime = moment(selectedDate).unix();
    const endTime = moment(selectedDate).add(1, 'day').unix();

    console.log('path:' + callcenterUrl);
    console.log('startTime:' + startTime);
    console.log('endTime:' + endTime);

    const params: HttpParams = new HttpParams();
    params.set('restaurantId', restaurantId);
    params.set('startTime', startTime);
    params.set('endTime', endTime);
    params.set('requestType', false);

    const options = { params: params };

    //Create model with values to represent correctly the structure.
    return this.http.get<any>(callcenterUrl, options);
  }
}
