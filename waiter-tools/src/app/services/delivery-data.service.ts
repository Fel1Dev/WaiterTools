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

  processRecords(rawData: any) {
    let deliveryList: DeliveryData[] = [];
    for (const delivery of rawData) {
      const newDelivery: DeliveryData = {
        id: delivery[0],
        date: moment(delivery[2]).toDate(),
        totalValue: delivery[3],
        deliveryValue: 0,
        deliveryType: delivery[5],
        clientName: delivery[9],
        address: delivery[10],
        cellphone: delivery[11],
        note: delivery[12],
        user: '',
      };
      deliveryList.push(newDelivery);
    }
    return deliveryList;
  }

  getTotalValue(deliveryList: DeliveryData[]) {
    let totalDelivery: number = 0;
    for (const delivery of deliveryList) {
      totalDelivery += Number(delivery.deliveryValue);
    }
    return totalDelivery;
  }

  getCallcenterReport2(selectedDate: string, restaurantId: string) {
    console.log('selectedDate:' + selectedDate);
    return of({
      data: [
        [
          'ba1f2c4840549a16ddbb0903',
          '15/07/2022',
          '15/07/2022T08:07:76',
          4900,
          null,
          'TAKEAWAY',
          null,
          null,
          null,
          'Carolina',
          null,
          null,
          null,
          'NEW',
        ],
        [
          '65752a235d41a38361c5fcf0',
          '15/07/2022',
          '15/07/2022T19:07:30',
          18200,
          null,
          'TAKEAWAY',
          null,
          null,
          null,
          'Felipe',
          null,
          null,
          null,
          'NEW',
        ],
        [
          '89c38877ff2b0fa74bbce253',
          '15/07/2022',
          '15/07/2022T08:07:95',
          13200,
          null,
          'Domicilio Aledaño',
          null,
          null,
          null,
          'Danna Rodríguez',
          'Carrea 17 # 21-30 la pradera',
          "'+57 322 5429397",
          null,
          'NEW',
        ],
        [
          '27f734b29e7c48cf7f554a89',
          '15/07/2022',
          '15/07/2022T08:07:72',
          11100,
          null,
          'Domicilio Aledaño',
          null,
          null,
          null,
          'Daniela charry',
          'Veterinaria Charry',
          "'+57 321 8268145",
          'Paga Transferencia',
          'NEW',
        ],
        [
          '695fccb7e12c1baa7cba2777',
          '15/07/2022',
          '15/07/2022T08:07:15',
          11800,
          null,
          'Domicilio Urbano',
          null,
          null,
          null,
          'Alejandro',
          ' CRA 9# 9-32. Juan de Ampudia ',
          "'316 4312162",
          null,
          'NEW',
        ],
        [
          'cd5891db336aee2cc1c22163',
          '15/07/2022',
          '15/07/2022T08:07:91',
          11300,
          null,
          'Domicilio Aledaño',
          null,
          null,
          null,
          'Marcela ',
          'CRA 14#18 35 la.pradera',
          "'310 5391946",
          'Paga exacto',
          'NEW',
        ],
        [
          '1eb7dde41a17dca9ed180155',
          '15/07/2022',
          '15/07/2022T08:07:37',
          19600,
          null,
          'LOS NARANJOS',
          null,
          null,
          null,
          'Oscar Mera',
          'Manzana 4 Torre 6 Apto 703',
          "'+57 314 7466908",
          'Pago transferencia',
          'NEW',
        ],
        [
          'f2494a7c689415fe670e4fb4',
          '15/07/2022',
          '15/07/2022T09:07:22',
          29500,
          null,
          'Domicilio Urbano',
          null,
          null,
          null,
          'Carolina M',
          'calle 19 # 9 - 07 OdontoFraGa',
          "'+57 313 7295488",
          null,
          'NEW',
        ],
        [
          'ac1b05d54c32dd6978ce020a',
          '15/07/2022',
          '15/07/2022T09:07:07',
          14200,
          null,
          'Domicilio Urbano',
          null,
          null,
          null,
          'Nicoll Roldan',
          'Colegio Fray Luis Apóstol Grado 6',
          null,
          null,
          'NEW',
        ],
        [
          'e668c19db6443e379afdd7eb',
          '15/07/2022',
          '15/07/2022T19:07:49',
          25600,
          null,
          'Domicilio Urbano',
          null,
          null,
          null,
          'Intendente Johany Castañeda',
          'Estación de policía',
          null,
          'Paga Transferencia',
          'NEW',
        ],
        [
          'ae30680afb2d453cd92c8e3f',
          '15/07/2022',
          '15/07/2022T19:07:35',
          23800,
          null,
          'Domicilio Aledaño',
          null,
          null,
          null,
          'Jhon mario',
          'Cra 18 # 21a12 la ',
          "'3195210041",
          'Paga con $25.000',
          'NEW',
        ],
      ],
    });
  }
}
