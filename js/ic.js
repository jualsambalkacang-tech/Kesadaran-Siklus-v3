// ====================================
// IC PREMIUM MODULE
// ====================================

function initIC(){

    console.log("IC Module Loaded");

    renderICToday();

}
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
// ====================================
// IC FLARE
// ====================================

function getTodayIC(){

    const date = currentDateKey();

    if(!DB.ic){
        DB.ic = {};
    }

    if(!DB.ic[date]){

        DB.ic[date] = {

            flare:0,

            triggers:[],

            note:""

        };

    }

    return DB.ic[date];

}
function saveTodayIC(flare,triggers,note){

    const date = currentDateKey();

    if(!DB.ic){
        DB.ic = {};
    }

    DB.ic[date]={

        flare:flare,

        triggers:triggers,

        note:note

    };

    saveDB();

}
function renderICToday(){

    const today = getTodayIC();

    get("todayFlare").textContent =
        today.flare;

    get("todayTrigger").textContent =
        today.triggers.length
        ? today.triggers.join(", ")
        : "-";

    get("todayICNote").textContent =
        today.note || "Belum ada catatan.";

}