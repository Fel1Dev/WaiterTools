import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppConstants } from '../shared/appConstants';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  //private tokenSubject: BehaviorSubject<String>;
  //public token: Observable<String>;

  constructor(private router: Router, private http: HttpClient) {}

  public get tokenValue(): any {
    return {
      waiterioToken: localStorage.getItem('waiterioToken'),
      currentRestaurantId: localStorage.getItem('currentRestaurantId'),
      currentUserId: localStorage.getItem('currentUserId'),
    };
  }

  login(username: string, password: string) {
    let credentials: string = window.btoa(username + ':' + password);
    let bodyData: any = {
      authenticationType: 'Basic ',
      authenticationCredentials: credentials,
    };
    const urlAuth = `${environment.BASE_URL}${environment.AUTH_PATH}`;

    return this.http.post<any>(urlAuth, bodyData);
  }

  logout() {
    localStorage.removeItem(AppConstants.WAITERIO_TOKEN);
    this.router.navigate(['/login']);
  }
}
