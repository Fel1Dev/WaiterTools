import { Component, Input, OnInit } from '@angular/core';
import { DeliveryDataService } from 'src/app/services';

@Component({
  selector: 'app-delivery-viewer',
  templateUrl: './delivery-viewer.component.html',
  styleUrls: ['./delivery-viewer.component.css']
})
export class DeliveryViewerComponent implements OnInit {

  @Input() visible!: boolean;
  @Input() dateSelected!: string;
  constructor(private deliveryDataService: DeliveryDataService   ) { }

  ngOnInit(): void {
    console.log('Domi Viewer');
    if (this.dateSelected) {

    }
  }

  getRecords() {

  }

}
