import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css'],
})
export class DeliveryComponent implements OnInit {
  dateSelected!: string;
  showViewer: boolean = false;
  constructor() {}

  ngOnInit(): void {
    //Temporal
    this.dateSelected = '2022-07-15';
    this.showViewer = true;
  }

  getDateValue(event: any) {
    if (event) {
      this.showViewer = true;
      this.dateSelected = event;
    }
  }
}
