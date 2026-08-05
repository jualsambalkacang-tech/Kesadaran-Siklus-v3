// ======================================
// Kesadaran Siklus v3
// app.js
// ======================================

// ---------- GLOBAL ----------

let peeChart = null;
let trendChart = null;
let monthlyTrendChart = null;
let waterChart = null;
let hourChart = null;
let moodChart = null;
let dayNightChart = null;
let flareChart = null;


// ---------- HELPER ----------

function get(id){
    return document.getElementById(id);
}

function average(list,key){

    if(!list.length) return 0;

    return list.reduce((a,b)=>a+Number(b[key]||0),0)/list.length;

}


// ---------- NAVIGASI ----------

function showSection(id){

    const pages=[
        "dashboard",
        "calendarSection",
        "dailySection",
        "quickAction",
        "todaySummary",
        "setupCard",
        "bladderDiary",
        "peeStats"
    ];

    pages.forEach(page=>{

        const el=get(page);

        if(el){

            el.style.display=
                page===id ? "block" : "none";

        }

    });

}


function initNavigation(){

    console.log("initNavigation jalan");

    get("navDashboard").onclick=()=>{

        console.log("Dashboard");

        showSection("dashboard");

    };

    get("navCalendar").onclick=()=>{

        console.log("Calendar");

        showSection("calendarSection");

    };

    get("navDaily").onclick=()=>{

        console.log("Daily");

        showSection("dailySection");

    };

    get("navIC").onclick=()=>{

        console.log("IC");

        showSection("bladderDiary");

    };

    get("navMore").onclick=()=>{

        console.log("More");

        showSection("quickAction");

    };

}


// ---------- DASHBOARD ----------

function updateDashboard(){

    const date=currentDateKey();

    const pee=DB.peeDiary[date]||[];

    get("todayPee").textContent=pee.length;

    get("todayPain").textContent=
        pee.length ? average(pee,"pain").toFixed(1) : "-";

    get("todayUrgency").textContent=
        pee.length ? average(pee,"urgency").toFixed(1) : "-";

    const daily=DB.daily[date]||{};

    get("todayMood").textContent=daily.mood||"-";

    get("todayWater").textContent=daily.water||0;

    get("todayBBT").textContent=daily.bbt||"-";

}
// ======================================
// BLADDER DIARY
// ======================================

function savePeeEntry(){

    const date = currentDateKey();

    if(!DB.peeDiary[date]){
        DB.peeDiary[date] = [];
    }

    DB.peeDiary[date].push({

        time:get("peeTime").value,

        pain:Number(get("peePain").value),

        urgency:Number(get("peeUrgency").value),

        volume:get("peeVolume").value,

        note:get("peeNote").value

    });

    saveDB();

    renderPeeHistory();

    updateDashboard();

}

function renderPeeHistory(){

    const date = currentDateKey();

    const list = DB.peeDiary[date] || [];

    const box = get("peeHistory");

    if(!box) return;

    box.innerHTML = "";

    list.forEach(item=>{

        box.innerHTML += `
        <div class="card">

            <b>${item.time}</b><br>

            🔥 Nyeri : ${item.pain}/10<br>

            ⚡ Urgensi : ${item.urgency}/10<br>

            🚻 ${item.volume}<br>

            📝 ${item.note || "-"}

        </div>
        `;

    });

}
// ======================================
// GRAFIK BAK
// ======================================

function renderPeeChart(){

    const date=currentDateKey();

    const list=DB.peeDiary[date]||[];

    const ctx=get("peeChart");

    if(!ctx) return;

    if(peeChart){

        peeChart.destroy();

    }

    peeChart=new Chart(ctx,{

        type:"line",

        data:{

            labels:list.map(x=>x.time),

            datasets:[

                {

                    label:"Nyeri",

                    data:list.map(x=>x.pain),

                    tension:0.3

                },

                {

                    label:"Urgensi",

                    data:list.map(x=>x.urgency),

                    tension:0.3

                }

            ]

        },

        options:{

            responsive:true

        }

    });

}


// ======================================
// TREN NYERI
// ======================================

function drawTrend(days){

    const keys=Object.keys(DB.peeDiary)
        .sort()
        .slice(-days);

    const labels=[];

    const pain=[];

    keys.forEach(date=>{

        labels.push(date.substring(5));

        pain.push(

            average(DB.peeDiary[date],"pain").toFixed(1)

        );

    });

    const ctx=get("trendChart");

    if(!ctx) return;

    if(trendChart){

        trendChart.destroy();

    }

    trendChart=new Chart(ctx,{

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

            responsive:true

        }

    });

}


function showWeeklyTrend(){

    drawTrend(7);

}


function showMonthlyTrend(){

    drawTrend(30);

}
// ======================================
// STATISTIK 30 HARI
// ======================================

function updateStatistics(){

    const keys = Object.keys(DB.peeDiary)
        .sort()
        .slice(-30);

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

    get("statPee").textContent = totalPee;
    get("statDays").textContent = keys.length;

    get("statPain").textContent =
        totalRecord ? (totalPain/totalRecord).toFixed(1) : "-";

    get("statUrgency").textContent =
        totalRecord ? (totalUrgency/totalRecord).toFixed(1) : "-";

}


// ======================================
// GRAFIK AIR & BBT
// ======================================

function showWaterChart(){

    const keys = Object.keys(DB.daily)
        .sort()
        .slice(-30);

    const labels = [];
    const water = [];
    const bbt = [];

    keys.forEach(date=>{

        labels.push(date.substring(5));

        water.push(Number(DB.daily[date].water || 0));

        bbt.push(Number(DB.daily[date].bbt || 0));

    });

    const ctx = get("waterChart");

    if(!ctx) return;

    if(waterChart){

        waterChart.destroy();

    }

    waterChart = new Chart(ctx,{

        type:"line",

        data:{

            labels:labels,

            datasets:[

                {

                    label:"Air",

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


// ======================================
// BAK PER JAM
// ======================================

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

    const ctx = get("hourChart");

    if(!ctx) return;

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
// ======================================
// START APP
// ======================================

document.addEventListener("DOMContentLoaded",()=>{

    console.log("DOM Loaded");

    initNavigation();

    console.log("Navigation OK");

    showSection("dashboard");

    console.log("Dashboard OK");

    updateDashboard();

    renderPeeHistory();

    renderPeeChart();

    updateStatistics();

    showWeeklyTrend();

    showWaterChart();

    showHourChart();

});
