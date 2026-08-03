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
const lastPeriod = DB.profile.lastPeriod;

if(lastPeriod){

    const lp = new Date(lastPeriod);

    const current = new Date(year,month,day);

    const diff = Math.floor(
        (current-lp)/(1000*60*60*24)
    );

    const cycle =
        ((diff % DB.profile.cycleLength)
        + DB.profile.cycleLength)
        % DB.profile.cycleLength + 1;

    // Hari menstruasi
    if(cycle<=DB.profile.periodLength){

        cell.classList.add("period");

    }

    // Masa subur
    if(cycle>=11 && cycle<=16){

        cell.classList.add("fertile");

    }

    // Ovulasi
    if(cycle==14){

        cell.classList.add("ovulation");

    }

}
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
document.getElementById("dailySection")
.scrollIntoView({
behavior:"smooth"
});
const input=document.getElementById("dailyDate");

if(input){

input.value=date;

}

if(typeof loadDaily==="function"){

loadDaily(date);

}

}

document.addEventListener("DOMContentLoaded",renderCalendar);
