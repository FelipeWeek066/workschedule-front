import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { day } from './calendar/day';

@Injectable({
  providedIn: 'root'
})


export class DataServiceService {
  private apiUrl = "http://localhost:8080";
  constructor(private httpClient: HttpClient) { }
  date = new Date();
  httpOptions = {
    headers : new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': 'Basic ' + btoa('user:3d0f97dc-03c7-4b8b-9f03-d7d41e1825b0')
    })
  };


  getMonthDays(date: Date): Observable<day[]>{
    let month = "0" + 0;
    if(date.getMonth() < 9){
       month = "0" +(date.getMonth()+1);
    }else{
      month = ""+(date.getMonth()+1);
    }
    return this.httpClient.get<day[]>(this.apiUrl + "/days?start=" + date.getFullYear() + "-" + month +
     "-01&end=" + date.getFullYear() + "-" +month + "-" + new Date(date.getFullYear(), date.getMonth()+1, 0).getDate());
    
   }


}
