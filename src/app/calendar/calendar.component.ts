import { Component, OnInit } from '@angular/core';
import { day }  from './day';
import { DataServiceService } from '../data-service.service';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, formatDate } from '@angular/common';
import { map } from 'rxjs';
import { stringify } from 'querystring';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { notEqual } from 'assert';

//the names in portugueze to use
const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

//colors that we see in calendar
const colors = ["green", "red"];
@Component({
  selector: 'app-calendar',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})




export class CalendarComponent implements OnInit
{
  monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  amountToReceive: number = 0;

  applyForm = new FormGroup({
    amount: new FormControl(0),
    note: new FormControl('')
  })
  editing = false;
  date = new Date();
  selected: day = {date: new Date(NaN), amount: 0, worked : false, note: ""};
  constructor(private dataCall: DataServiceService)
  {

  }
  
  days: day[] = [];

  
  tempDays: day[] = [];

  month: string = monthNames[this.date.getMonth()];
  year: number = this.date.getFullYear();


  public  updateCalendar(){
    this.dataCall.getMonthDays(this.date).subscribe((days)=> {
      days.forEach(x => x.date = new Date(x.date));
     this.tempDays = days;
     this.amountToReceive = 0;
     
     this.date.setDate(1);

     this.days = [];
     for(let i = 0; i < 42; i++)
       {
       if(i >= this.date.getDay() && i < new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDate() + this.date.getDay())
         {
         if(this.tempDays.findIndex((x) => x.date.getDate() == i - this.date.getDay()+1) != -1)
         {
           
           let temday = this.tempDays[this.tempDays.findIndex((x) => x.date.getDate() == i - this.date.getDay()+1)];
 
               console.log(temday.worked);
             let nullDay: day = {date: temday.date,worked: true, amount: temday.amount, note: temday.note};
             this.days.push(nullDay);
             this.amountToReceive += temday.amount;
           
         }else{
         
           let day: day = {date: new Date(this.date.getFullYear(), this.date.getMonth(), i - this.date.getDay() + 1),worked: false, amount: 0, note: ""};
           this.days.push(day);
       }
           
     }else{
         let nullDay: day = {date: new Date(NaN),worked: undefined, amount: 0, note: ""};
        
         console.log(nullDay.worked);
           this.days.push(nullDay);
     }
     
 
   
   }
 
   });
  }

  submitDay(){
    let tempDay: any = {date: formatDate(this.selected.date, "yyyy-MM-dd", "en-US"),
        amount: this.applyForm.value.amount ?? 0,
         note: this.applyForm.value.note ?? "",
      
    };
    console.log(tempDay);
    this.dataCall.postDay(tempDay).subscribe(response => this.updateCalendar());
    
  }
  
  deleteSelectDay(){
    this.dataCall.deleteDay(this.selected.date).subscribe(response => this.updateCalendar());
    
  }

  updateDay(){
    let tempDay: any = {date: formatDate(this.selected.date, "yyyy-MM-dd", "en-US"),
       amount: this.applyForm.value.amount ?? 0,
        note: this.applyForm.value.note ?? "",
     
   };
   this.dataCall.updateDay(tempDay).subscribe(response => this.updateCalendar());
  }



  public ngOnInit(): void{   
    const formattedDate = this.date.toLocaleString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    this.date.setDate(1);
    this.updateCalendar();
    console.log(new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDate());

  }
}
