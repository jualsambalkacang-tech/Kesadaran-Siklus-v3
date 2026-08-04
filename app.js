function savePeeEntry(){

const date=currentDateKey();

if(!DB.peeDiary[date]){
DB.peeDiary[date]=[];
}

DB.peeDiary[date].push({

time:document.getElementById("peeTime").value,

pain:document.getElementById("peePain").value,

urgency:document.getElementById("peeUrgency").value,

volume:document.getElementById("peeVolume").value,

note:document.getElementById("peeNote").value

});

saveDB();

renderPeeHistory();
renderPeeChart();
updateDashboard();
}
let peeChart=null;

function renderPeeChart(){

const date=currentDateKey();

const data=DB.peeDiary[date]||[];

const labels=data.map(x=>x.time);

const pain=data.map(x=>Number(x.pain));

const urgency=data.map(x=>Number(x.urgency));

const ctx=document.getElementById("peeChart");

if(!ctx)return;

if(peeChart){
peeChart.destroy();
}
let trendChart = null;

function drawTrend(labels,pain){

const ctx=document.getElementById("trendChart");

if(!ctx)return;

if(trendChart){
trendChart.destroy();
}
function showWeeklyTrend(){

const keys=Object.keys(DB.peeDiary).sort().slice(-7);

const labels=[];

const pain=[];

keys.forEach(date=>{

labels.push(date.substring(5));

const list=DB.peeDiary[date];

const avg=list.reduce((a,b)=>a+Number(b.pain),0)/list.length;

pain.push(avg.toFixed(1));

});

drawTrend(labels,pain);

}
  function showMonthlyTrend(){

const keys=Object.keys(DB.peeDiary).sort().slice(-30);

const labels=[];

const pain=[];

keys.forEach(date=>{

labels.push(date.substring(5));

const list=DB.peeDiary[date];

const avg=list.reduce((a,b)=>a+Number(b.pain),0)/list.length;

pain.push(avg.toFixed(1));

});

drawTrend(labels,pain);

}
trendChart=new Chart(ctx,{
type:"line",
data:{
labels,
datasets:[
{
label:"Nyeri IC",
data:pain
}
]
}
});

}
peeChart=new Chart(ctx,{

type:"line",

data:{

labels,

datasets:[

{

label:"Nyeri",

data:pain

},

{

label:"Urgensi",

data:urgency

}

]

}

});

}
function renderPeeHistory(){

const date=currentDateKey();

const list=DB.peeDiary[date]||[];

const box=document.getElementById("peeHistory");

box.innerHTML="";

list.forEach(item=>{

box.innerHTML+=`

<div class="card">

🕒 ${item.time}<br>

🔥 Nyeri ${item.pain}/10<br>

⚡ Urgensi ${item.urgency}/10<br>

🚻 ${item.volume}<br>

📝 ${item.note}

</div>

`;

});

}
function updateDashboard(){

const date=currentDateKey();

const pee=DB.peeDiary?.[date]||[];

document.getElementById("todayPee").textContent=pee.length;

if(pee.length){

const pain=pee.reduce((a,b)=>a+Number(b.pain),0)/pee.length;

const urgency=pee.reduce((a,b)=>a+Number(b.urgency),0)/pee.length;

document.getElementById("todayPain").textContent=pain.toFixed(1);

document.getElementById("todayUrgency").textContent=urgency.toFixed(1);

}else{

document.getElementById("todayPain").textContent="-";

document.getElementById("todayUrgency").textContent="-";

}

const daily=DB.daily?.[date]||{};

document.getElementById("todayMood").textContent=daily.mood||"-";

document.getElementById("todayWater").textContent=daily.water||0;

document.getElementById("todayBBT").textContent=daily.bbt||"-";

}
let monthlyTrendChart = null;

function showMonthlyTrend(){

    const keys=Object.keys(DB.peeDiary).sort().slice(-30);

    const labels=[];
    const pain=[];

    keys.forEach(date=>{

        labels.push(date.substring(5));

        const list=DB.peeDiary[date];

        const avg=list.reduce((a,b)=>a+Number(b.pain),0)/list.length;

        pain.push(avg.toFixed(1));

    });

    const ctx = document
    .getElementById("monthlyTrendChart")
    .getContext("2d");

if(monthlyTrendChart){
    monthlyTrendChart.destroy();
}

monthlyTrendChart = new Chart(ctx,{
    type:"line",
    data:{
        labels:labels,
        datasets:[{
            label:"Nyeri",
            data:pain,
            tension:0.3
        }]
    },
    options:{
        responsive:true,
        plugins:{
            legend:{
                display:false
            }
        },
        scales:{
            y:{
                beginAtZero:true,
                max:10
            }
        }
    }
});

}
function updateStatistics(){

    const keys = Object.keys(DB.peeDiary).sort().slice(-30);

    let totalPee = 0;
    let totalPain = 0;
    let totalUrgency = 0;
    let totalRecord = 0;

    keys.forEach(date=>{

        const list = DB.peeDiary[date];

        totalPee += list.length;

        list.forEach(item=>{

            totalPain += Number(item.pain);
            totalUrgency += Number(item.urgency);
            totalRecord++;

        });

    });

    document.getElementById("statPee").textContent = totalPee;

    document.getElementById("statDays").textContent = keys.length;

    document.getElementById("statPain").textContent =
        totalRecord ? (totalPain/totalRecord).toFixed(1) : "-";

    document.getElementById("statUrgency").textContent =
        totalRecord ? (totalUrgency/totalRecord).toFixed(1) : "-";

}
document.addEventListener("DOMContentLoaded",()=>{

renderPeeHistory();

renderPeeChart();
  
showWeeklyTrend();

showMonthlyTrend();
  
updateDashboard();

updateStatistics();
});
