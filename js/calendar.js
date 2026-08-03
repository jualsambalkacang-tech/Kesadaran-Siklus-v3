// ======================================
// Kesadaran Siklus v3
// Calendar Module
// ======================================

const monthNames=[
"Januari","Februari","Maret","April","Mei","Juni",
"Juli","Agustus","September","Oktober","November","Desember"
];

let currentDate=new Date();

function renderCalendar(){

const calendar=document.getElementById("calendar");

if(!calendar)return;

calendar.innerHTML="";

const year=currentDate.getFullYear();

const month=currentDate.getMonth();

const firstDay=new Date(year,month,1).getDay();

const daysInMonth=new Date(year,month+1,0).getDate();

document.getElementById("calendarTitle").textContent=
monthNames[month]+" "+year;

for(let i=0;i<firstDay;i++){

const empty=document.createElement("div");

empty.className="calendar-empty";

calendar.appendChild(empty);

}

for(let day=1;day<=daysInMonth;day++){

const cell=document.createElement("button");

cell.className="calendar-day";

cell.innerHTML=day;

const dateString=

year+"-"+
String(month+1).padStart(2,"0")+"-"+
String(day).padStart(2,"0");

if(DB.daily[dateString]){

cell.classList.add("has-note");

}

cell.onclick=()=>{

openDaily(dateString);

};

calendar.appendChild(cell);

}

}

function prevMonth(){

currentDate.setMonth(currentDate.getMonth()-1);

renderCalendar();

}

function nextMonth(){

currentDate.setMonth(currentDate.getMonth()+1);

renderCalendar();

}

function openDaily(date){

const input=document.getElementById("dailyDate");

if(input){

input.value=date;

}

if(typeof loadDaily==="function"){

loadDaily(date);

}

}

document.addEventListener("DOMContentLoaded",renderCalendar);
