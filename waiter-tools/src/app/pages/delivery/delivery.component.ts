import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css'],
})
export class DeliveryComponent implements OnInit {
  dateSelected!: boolean;
  constructor() {}

  ngOnInit(): void {}

  getDateValue(event:any) {
    console.log(event);
  }
}
