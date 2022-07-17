import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AuthenticationService, DeliveryDataService } from 'src/app/services';
import { DeliveryData } from 'src/app/shared/delivery-data.model';

@Component({
  selector: 'app-delivery-viewer',
  templateUrl: './delivery-viewer.component.html',
  styleUrls: ['./delivery-viewer.component.css'],
})
export class DeliveryViewerComponent implements OnInit {
  @Input() visible!: boolean;
  @Input() dateSelected!: string;

  loading = false;
  deliveryList: any[] = [];
  error = '';

  constructor(
    private deliveryDataService: DeliveryDataService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.getRecords();
  }

  getRecords() {
    this.loading = true;
    if (this.dateSelected) {
      const tokenValue = this.authenticationService.tokenValue;
      const restaurantId = tokenValue.currentRestaurantId;

      this.deliveryDataService
        .getCallcenterReport(this.dateSelected, restaurantId)
        .subscribe({
          next: (response: any) => {
            console.log(response.data);
            for (const delivery of response.data) {
              const newDelivery: DeliveryData = {
                id: delivery[0],
                date: moment(delivery[2]).toDate(),
                totalValue: delivery[3],
                deliveryType: delivery[5],
                clientName: delivery[9],
                address: delivery[10],
                cellphone: delivery[11],
                note: delivery[12],
                user: '',
              };
              console.log(newDelivery);
              this.deliveryList.push(newDelivery);
            }
          },
          error: (err) => {
            this.loading = false;
            this.error = err;
          },
        });
      this.loading = false;
    }
  }
}
