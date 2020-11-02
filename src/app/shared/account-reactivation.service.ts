import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from "rxjs/operators";
import { throwError as observableThrowError, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AccountReactivationService {

  constructor(private http: HttpClient) { }
  apiUrl = 'https://localhost:44314';

  /*requestInitiation(body){
    let data = JSON.stringify(body)
    return this.http.post(`${this.apiUrl}/api/request-manager/ValidateAccountNoAndPhone`, data)
    // return this.http.post(`${this.apiUrl}/redbox-util/validate-account-and-phone`, data)
    .pipe( map((res) => res), 
      catchError((error) => observableThrowError(error.error || 'Server error')),);
  }*/
}
