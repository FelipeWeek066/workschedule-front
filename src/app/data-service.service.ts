import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { day } from './calendar/day';
import { CommonModule, formatDate } from '@angular/common';
import { enviroment } from '../enviroments/enviroment';
@Injectable({
  providedIn: 'root'
})


export class DataServiceService {
  private apiUrl = enviroment.API_BASE_URL;
  constructor(private httpClient: HttpClient) { }
  date = new Date();
  httpOptions = {
    headers : new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': 'Basic ' + btoa('user:3d0f97dc-03c7-4b8b-9f03-d7d41e1825b0')
    })
  };

  // return every day of a month
  getMonthDays(date: Date): Observable<day[]>{ 
    let month = "0" + 0;
    if(date.getMonth() < 9){
       month = "0" +(date.getMonth()+1);
    }else{
      month = ""+(date.getMonth()+1);
    }
    return this.httpClient.get<day[]>(this.apiUrl + "/days?start=" + formatDate(date, "yyyy-MM-", "en-US") + "01&end=" //first day of month
     + formatDate(date, "yyyy-MM-", "en-US")  + new Date(date.getFullYear(), date.getMonth()+1, 0).getDate()); //last day of the month
    
   }

   postDay(day: any): Observable<day>{
    
    return this.httpClient.post<day>(this.apiUrl+"/days", day); 
   }

   deleteDay(day: Date){
    return this.httpClient.delete<any>(this.apiUrl+"/days/"+formatDate(day, "yyyy-MM-dd", "en-US"));
   }

   updateDay(day: any): Observable<any>{
      return this.httpClient.put<any>(this.apiUrl+"/days/" + formatDate(day.date, "yyyy-MM-dd", "en-US"), day);
   }

}
