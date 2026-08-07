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
let flareChart = null;

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
let waterChart = null;

function showWaterChart(){

    const keys = Object.keys(DB.daily).sort().slice(-30);

    const labels = [];
    const water = [];
    const bbt = [];

    keys.forEach(date=>{

        labels.push(date.substring(5));

        water.push(Number(DB.daily[date].water || 0));

        bbt.push(Number(DB.daily[date].bbt || 0));

    });

    const ctx = document
        .getElementById("waterChart")
        .getContext("2d");

    if(waterChart){
        waterChart.destroy();
    }

    waterChart = new Chart(ctx,{
        type:"line",
        data:{
            labels:labels,
            datasets:[
                {
                    label:"Air (ml)",
                    data:water
                },
                {
                    label:"BBT",
                    data:bbt
                }
            ]
        },
        options:{
            responsive:true
        }
    });

}
let hourChart = null;

function showHourChart(){

    const hours = Array(24).fill(0);

    Object.values(DB.peeDiary).forEach(list=>{

        list.forEach(item=>{

            if(item.time){

                const h = Number(item.time.split(":")[0]);

                if(!isNaN(h)){

                    hours[h]++;

                }

            }

        });

    });

    drawHourChart(hours);

}
function drawHourChart(hours){

    const ctx = document
        .getElementById("hourChart")
        .getContext("2d");

    if(hourChart){

        hourChart.destroy();

    }

    hourChart = new Chart(ctx,{

        type:"bar",

        data:{

            labels:[
                "0","1","2","3","4","5",
                "6","7","8","9","10","11",
                "12","13","14","15","16","17",
                "18","19","20","21","22","23"
            ],

            datasets:[{

                label:"BAK",

                data:hours

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{

                    display:false

                }

            }

        }

    });

}
let moodChart = null;

function showMoodChart(){

    const keys = Object.keys(DB.daily).sort().slice(-30);

    const labels = [];

    const mood = [];

    const moodMap = {

        "😞":1,

        "😐":2,

        "🙂":3,

        "😊":4,

        "😁":5

    };

    keys.forEach(date=>{

        labels.push(date.substring(5));

        const m = DB.daily[date].mood || "😐";

        mood.push(moodMap[m] || 2);

    });

    drawMoodChart(labels,mood);

}
function drawMoodChart(labels,mood){

    const ctx = document
        .getElementById("moodChart")
        .getContext("2d");

    if(moodChart){

        moodChart.destroy();

    }

    moodChart = new Chart(ctx,{

        type:"line",

        data:{

            labels:labels,

            datasets:[{

                label:"Mood",

                data:mood,

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

                    min:1,

                    max:5,

                    ticks:{

                        stepSize:1

                    }

                }

            }

        }

    });

}
function showPainHeatmap(){

    const box=document.getElementById("painHeatmap");

    if(!box) return;

    box.innerHTML="";

    const keys=Object.keys(DB.peeDiary).sort().slice(-30);

    keys.forEach(date=>{

        const list=DB.peeDiary[date];

        const avg=list.reduce((a,b)=>a+Number(b.pain),0)/list.length;

        const cell=document.createElement("div");

        cell.className="heatCell";

        cell.textContent=date.substring(8);

        cell.style.opacity=avg/10;

        box.appendChild(cell);

    });

}
let dayNightChart=null;

function showDayNightChart(){

    let day=0;

    let night=0;

    Object.values(DB.peeDiary).forEach(list=>{

        list.forEach(item=>{

            if(!item.time) return;

            const h=Number(item.time.split(":")[0]);

            if(h>=6 && h<18){

                day++;

            }else{

                night++;

            }

        });

    });

    drawDayNight(day,night);

}
function drawDayNight(day,night){

    const ctx=document
        .getElementById("dayNightChart")
        .getContext("2d");

    if(dayNightChart){

        dayNightChart.destroy();

    }

    dayNightChart=new Chart(ctx,{

        type:"doughnut",

        data:{

            labels:["Siang","Malam"],

            datasets:[{

                data:[day,night]

            }]

        },

        options:{

            responsive:true

        }

    });

}
function updateRiskScore(){

    const today=new Date().toISOString().slice(0,10);

    const list=DB.peeDiary?.[today]||[];

    if(list.length===0){

        document.getElementById("riskScore").textContent=0;

        document.getElementById("riskText").textContent="Belum ada data";

        return;

    }

    const pee=list.length;

    const pain=list.reduce((a,b)=>a+Number(b.pain),0)/pee;

    const urgency=list.reduce((a,b)=>a+Number(b.urgency),0)/pee;

    let score=(pain*5)+(urgency*5)+(pee*2);

    score=Math.min(100,Math.round(score));

    document.getElementById("riskScore").textContent=score;

    if(score<30){

        document.getElementById("riskText").textContent="🟢 Stabil";

    }else if(score<60){

        document.getElementById("riskText").textContent="🟡 Sedang";

    }else{

        document.getElementById("riskText").textContent="🔴 Flare IC";

    }

}
function updateFlareHistory(){

    const box=document.getElementById("flareHistory");

    const days=Object.keys(DB.peeDiary).sort().reverse();

    let html="";

    days.forEach(date=>{

        const list=DB.peeDiary[date];

        const pain=list.reduce((a,b)=>a+Number(b.pain),0)/list.length;

        const urgency=list.reduce((a,b)=>a+Number(b.urgency),0)/list.length;

        const score=(pain*5)+(urgency*5)+(list.length*2);

        if(score>=60){

            html+=`<p>🔴 ${date} (${Math.round(score)})</p>`;

        }

    });

    box.innerHTML=html||"Belum ada flare.";

}
function showFlareChart(){

    const keys = Object.keys(DB.peeDiary).sort();

    const labels = [];
    const flare = [];

    keys.forEach(date=>{

        const list = DB.peeDiary[date];

        const pain =
            list.reduce((a,b)=>a+Number(b.pain),0)/list.length;

        const urgency =
            list.reduce((a,b)=>a+Number(b.urgency),0)/list.length;

        const score = (pain*5)+(urgency*5)-10;

        labels.push(date.substring(5));
        flare.push(Math.max(0,Math.round(score)));

    });

    const ctx=document
        .getElementById("flareChart")
        .getContext("2d");

    if(flareChart){
        flareChart.destroy();
    }

    flareChart=new Chart(ctx,{
        type:"bar",
        data:{
            labels:labels,
            datasets:[{
                label:"Skor Flare",
                data:flare
            }]
        },
        options:{
            responsive:true,
            scales:{
                y:{
                    beginAtZero:true,
                    max:100
                }
            }
        }
    });

}
function showFlareChart(){

    const months={};

    Object.keys(DB.peeDiary).forEach(date=>{

        const list=DB.peeDiary[date];

        const pain=list.reduce((a,b)=>a+Number(b.pain),0)/list.length;

        const urgency=list.reduce((a,b)=>a+Number(b.urgency),0)/list.length;

        const score=(pain*5)+(urgency*5)+(list.length*2);

        if(score>=60){

            const month=date.substring(0,7);

            months[month]=(months[month]||0)+1;

        }

    });

    const labels=Object.keys(months);

    const data=Object.values(months);

    const ctx=document.getElementById("flareChart").getContext("2d");

    if(flareChart){

        flareChart.destroy();

    }

    flareChart=new Chart(ctx,{

        type:"bar",

        data:{

            labels:labels,

            datasets:[{

                label:"Flare",

                data:data

            }]

        },

        options:{

            responsive:true

        }

    });

}
function updatePrediction(){

    const days=Object.keys(DB.peeDiary).sort();

    if(days.length<3){

        document.getElementById("predictionScore").textContent="-";

        document.getElementById("predictionText").textContent="Belum cukup data";

        return;

    }

    const last=days.slice(-3);

    let score=0;

    last.forEach(date=>{

        const list=DB.peeDiary[date];

        const pain=list.reduce((a,b)=>a+Number(b.pain),0)/list.length;

        const urgency=list.reduce((a,b)=>a+Number(b.urgency),0)/list.length;

        score+=(pain*5)+(urgency*5)+(list.length*2);

    });

    score=Math.round(score/3);

    document.getElementById("predictionScore").textContent=score;

    if(score<30){

        document.getElementById("predictionText").textContent="🟢 Risiko rendah";

    }else if(score<60){

        document.getElementById("predictionText").textContent="🟡 Risiko sedang";

    }else{

        document.getElementById("predictionText").textContent="🔴 Risiko tinggi";

    }

}
function updateTriggerAnalysis(){

    const box=document.getElementById("triggerResult");

    const days=Object.keys(DB.daily).sort();

    if(days.length<5){

        box.innerHTML="Belum cukup data.";

        return;

    }

    let lowWater=0;

    let highPain=0;

    days.forEach(date=>{

        const daily=DB.daily[date];

        const pee=DB.peeDiary?.[date]||[];

        if(pee.length===0) return;

        const pain=pee.reduce((a,b)=>a+Number(b.pain),0)/pee.length;

        if(Number(daily.water)<1500 && pain>=6){

            lowWater++;

        }

        if(pain>=8){

            highPain++;

        }

    });

    box.innerHTML=`
        <p>💧 Flare saat minum kurang : ${lowWater} hari</p>
        <p>🔥 Nyeri berat : ${highPain} hari</p>
    `;

}
function updateFoodAnalysis(){

    const box=document.getElementById("foodAnalysis");

    if(!DB.daily){

        box.innerHTML="Belum ada data.";

        return;

    }

    const foods={};

    Object.keys(DB.daily).forEach(date=>{

        const daily=DB.daily[date];

        if(!daily.food) return;

        daily.food
            .split(",")
            .map(f=>f.trim())
            .forEach(food=>{

                if(!foods[food]){

                    foods[food]=0;

                }

                foods[food]++;

            });

    });

    const list=Object.entries(foods)
        .sort((a,b)=>b[1]-a[1])
        .slice(0,5);

    if(list.length===0){

        box.innerHTML="Belum ada data makanan.";

        return;

    }

    box.innerHTML=list
        .map(x=>`<p>🍴 ${x[0]} (${x[1]}x)</p>`)
        .join("");

}
function updateFlareFoodAnalysis(){

    const box=document.getElementById("flareFoodAnalysis");

    const foods={};

    Object.keys(DB.daily||{}).forEach(date=>{

        const pee=DB.peeDiary?.[date]||[];

        if(pee.length===0) return;

        const pain=pee.reduce((a,b)=>a+Number(b.pain),0)/pee.length;

        const urgency=pee.reduce((a,b)=>a+Number(b.urgency),0)/pee.length;

        const score=(pain*5)+(urgency*5)+(pee.length*2);

        if(score<60) return;

        const daily=DB.daily[date];

        if(!daily?.food) return;

        daily.food.split(",").forEach(food=>{

            food=food.trim();

            if(!food) return;

            foods[food]=(foods[food]||0)+1;

        });

    });

    const result=Object.entries(foods)
        .sort((a,b)=>b[1]-a[1])
        .slice(0,5);

    if(result.length===0){

        box.innerHTML="Belum ada flare yang memiliki data makanan.";

        return;

    }

    box.innerHTML=result
        .map(x=>`<p>⚠️ ${x[0]} (${x[1]}x)</p>`)
        .join("");

}
function updateAIInsight(){

    const box=document.getElementById("aiInsight");

    const messages=[];

    const days=Object.keys(DB.peeDiary||{}).sort();

    if(days.length<7){

        box.innerHTML="Belum cukup data.";

        return;

    }

    let avgPain=0;
    let totalRecord=0;

    days.forEach(date=>{

        const list=DB.peeDiary[date];

        list.forEach(item=>{

            avgPain+=Number(item.pain);

            totalRecord++;

        });

    });

    avgPain/=totalRecord;

    if(avgPain>=7){

        messages.push("🔴 Nyeri rata-rata masih tinggi.");

    }else if(avgPain>=4){

        messages.push("🟡 Nyeri sedang.");

    }else{

        messages.push("🟢 Nyeri relatif ringan.");

    }

    const flareDays=days.filter(date=>{

        const list=DB.peeDiary[date];

        const pain=list.reduce((a,b)=>a+Number(b.pain),0)/list.length;

        return pain>=7;

    });

    messages.push("🚨 Hari flare: "+flareDays.length);

    box.innerHTML=messages.map(x=>`<p>${x}</p>`).join("");

}
document.addEventListener("DOMContentLoaded",()=>{

renderPeeHistory();

renderPeeChart();
  
showWeeklyTrend();

showMonthlyTrend();

showHourChart();
  
// showMoodChart();

// showPainHeatmap();

// showDayNightChart();

// updateRiskScore();

// updateFlareHistory();

// showFlareChart();

// updatePrediction();

// updateTriggerAnalysis();

// updateFoodAnalysis();

// updateFlareFoodAnalysis();

// updateAIInsight();
  
updateDashboard();

updateStatistics();

showWaterChart();

showFlareChart();
});
