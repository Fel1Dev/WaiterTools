import { HttpClient, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DeliveryDataService {
  constructor(private http: HttpClient) {}

  getCallcenterReport(selectedDate: Date, restaurantId: string) {
    const callcenterUrl = `${environment.BASE_URL}${environment.CALLCENTER_PATH}`;
    const httpOptions: HttpParamsOptions = {};
    //Query parametesr
    
    //Create model with values to represent correctly the structure.
    this.http.get<any>(callcenterUrl, {});
    //return all
  }
}
