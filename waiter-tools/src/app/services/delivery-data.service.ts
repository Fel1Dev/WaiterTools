import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DeliveryData } from '../shared/delivery-data.model';

@Injectable({
  providedIn: 'root',
})
export class DeliveryDataService {
  constructor(private http: HttpClient) {}

  getCallcenterReport(selectedDate: string, restaurantId: string) {
    const callcenterUrl = `${environment.BASE_URL}${environment.DELIVERY_PATH}`;
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

  processRecords(rawData: any) {
    let deliveryList: DeliveryData[] = [];
    for (const delivery of rawData) {
      const newDelivery: DeliveryData = {
        id: delivery.id,
        date: moment(delivery.date).toDate(),
        totalValue: delivery.totalValue,
        userDeliveryPrice: delivery.userDeliveryPrice,
        deliveryPrice: delivery.deliveryPrice,
        deliveryType: delivery.deliveryType,
        clientName: delivery.clientName,
        address: delivery.address,
        cellphone: delivery.cellphone,
        note: delivery.note,
        user: delivery.user,
      };
      deliveryList.push(newDelivery);
    }
    return deliveryList;
  }

  getTotalValue(deliveryList: DeliveryData[]) {
    let totalDelivery: number = 0;
    for (const delivery of deliveryList) {
      totalDelivery += Number(delivery.deliveryPrice);
    }
    return totalDelivery;
  }
}
