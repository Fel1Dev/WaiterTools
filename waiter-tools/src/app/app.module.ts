import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DeliveryComponent } from './pages/delivery/delivery.component';
import { DeliveryProcessorComponent } from './component/delivery-processor/delivery-processor.component';
import { DeliveryViewerComponent } from './component/delivery-viewer/delivery-viewer.component';
import { DeliveryRecordComponent } from './component/delivery-record/delivery-record.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    DeliveryComponent,
    DeliveryProcessorComponent,
    DeliveryViewerComponent,
    DeliveryRecordComponent    
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
