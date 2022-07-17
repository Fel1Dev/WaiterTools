import { Component, Input, OnInit } from '@angular/core';
import { DeliveryData } from 'src/app/shared/delivery-data.model';

@Component({
  selector: 'app-delivery-record',
  templateUrl: './delivery-record.component.html',
  styleUrls: ['./delivery-record.component.css']
})
export class DeliveryRecordComponent implements OnInit {
  @Input() deliveryData!: DeliveryData;

  constructor() { }

  ngOnInit(): void {
  }

}
