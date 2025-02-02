import { Component, OnInit } from '@angular/core';
import { day }  from './day';
import { DataServiceService } from '../data-service.service';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';
import { stringify } from 'querystring';



const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];
const colors = ["green", "red"];
@Component({
  selector: 'app-calendar',
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit
{
  monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  date = new Date();
  selected: day = {date: new Date(), amount: 0, worked : false, note: "", color: ""};
  constructor(private dataCall: DataServiceService)
  {

  }
  
  days: day[] = [];

  
  tempDays: day[] = [];

  month: string = monthNames[this.date.getMonth()];
  year: number = this.date.getFullYear();

  public lowerMonth(){
      this.date.setMonth(this.date.getMonth() - 1);
      this.updateCalendar();
  }
  public upperMonth(){
      this.date.setMonth(this.date.getMonth() + 1);
      this.updateCalendar();
  }
  public  updateCalendar(){
    this.dataCall.getMonthDays(this.date).subscribe((days)=> {
      days.forEach(x => x.date = new Date(x.date));
     this.tempDays = days;
     this.renderCalendar();

   });
  }
  private renderCalendar(){
    console.log(this.date.getMonth() + " == " + new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDate());
    this.month = monthNames[this.date.getMonth()];
    this.year = this.date.getFullYear();
    this.date.setDate(1);

    this.days = [];
    for(let i = 0; i < 42; i++)
      {
      if(i >= this.date.getDay() && i < new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDate() + this.date.getDay())
        {
        if(this.tempDays.findIndex((x) => x.date.getDate() == i - this.date.getDay()+1) != -1)
        {
          
          let temday = this.tempDays[this.tempDays.findIndex((x) => x.date.getDate() == i - this.date.getDay()+1)];

          if(temday.worked)
            {
            let nullDay: day = {date: temday.date,worked: temday.worked, amount: temday.amount, note: temday.note, color: "green"};
            this.days.push(nullDay);
          }else
          {
            let nullDay: day = {date: temday.date,worked: temday.worked, amount: temday.amount, note: temday.note, color: "red" };
            this.days.push(nullDay);
          }
          
        }else{
        
          let day: day = {date: new Date(this.date.getFullYear(), this.date.getMonth(), i - this.date.getDay() + 1),worked: undefined, amount: 0, note: "", color: "white"};
          this.days.push(day);
      }
          
    }else{
        let nullDay: day = {date: new Date(0),worked: undefined, amount: undefined, note: "", color: "gray"};
          this.days.push(nullDay);
    }
    

  
  }
}
public getStatusOfSelected(): boolean{
  if(this.selected.worked == undefined){
    return true;
  }else{
    return false;
  }
}
  public setFocus(value: number){
    this.selected = this.days[value];
  }
  public ngOnInit(): void{   
    const formattedDate = this.date.toLocaleString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    this.date.setDate(1);
    this.updateCalendar();
    console.log(new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDate());

  }
}
