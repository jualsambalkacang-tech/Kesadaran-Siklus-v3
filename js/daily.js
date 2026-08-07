// =======================================
// DAILY MODULE
// =======================================

window.DB = window.DB || {};
DB.daily = DB.daily || {};

function loadDaily(date){
    if(!date) return;

    if(!DB.daily[date]){
        DB.daily[date]={
            mood:"",
            energy:"",
            ic:"",
            note:""
        };
    }

    document.getElementById("dailyDate").value=date;
    document.getElementById("dailyMood").value=DB.daily[date].mood;
    document.getElementById("dailyEnergy").value=DB.daily[date].energy;
    document.getElementById("dailyIC").value=DB.daily[date].ic;
    document.getElementById("dailyNote").value=DB.daily[date].note;

}

function saveCurrentDaily(){

    const date=document.getElementById("dailyDate").value;

    if(date===""){
        alert("Pilih tanggal terlebih dahulu.");
        return;
    }

    DB.daily[date]={

        mood:document.getElementById("dailyMood").value,

        energy:document.getElementById("dailyEnergy").value,

        ic:document.getElementById("dailyIC").value,

        note:document.getElementById("dailyNote").value

    };

    saveDB();

    alert("Catatan berhasil disimpan.");
    renderDailyHistory();

}
function renderDailyHistory(){

    const container = document.getElementById("dailyHistory");

    if(!container) return;

    container.innerHTML="";

    const daily = DB.daily || {};

    const dates = Object.keys(daily).sort().reverse();

    if(dates.length===0){

        container.innerHTML="<p>Belum ada catatan.</p>";

        return;

    }

    dates.forEach(date=>{

        const d = daily[date];

        const card = document.createElement("div");

        card.className="card";

       card.innerHTML=`

<h4>📅 ${date}</h4>

<p><b>😊 Mood</b><br>${d.mood||"-"}</p>

<p><b>⚡ Energi</b><br>${d.energy||"-"}</p>

<p><b>🩺 Gejala IC</b><br>${d.ic||"-"}</p>

<p><b>📝 Catatan</b><br>${d.note||"-"}</p>

<div class="history-buttons">

<button onclick="editDaily('${date}')">

✏️ Edit

</button>

<button onclick="deleteDaily('${date}')">

🗑️ Hapus

</button>

</div>

`;

        container.appendChild(card);

    });

}
document.addEventListener("DOMContentLoaded",function(){

    renderDailyHistory();

    showWeeklyTrend();

});
function editDaily(date){

    loadDaily(date);

    document.getElementById("dailyDate").value = date;

    document.getElementById("dailySection")
        .scrollIntoView({behavior:"smooth"});

}
function deleteDaily(date){

    if(!confirm("Hapus catatan ini?")) return;

    delete DB.daily[date];

    saveDB();

    renderDailyHistory();

    alert("Catatan berhasil dihapus.");

}

function drawTrend(labels, pain){

    const canvas = document.getElementById("trendChart");

    if(!canvas) return;

    const ctx = canvas.getContext("2d");

    if(trendChart){
        trendChart.destroy();
    }

    trendChart = new Chart(ctx,{
        type:"line",
        data:{
            labels:labels,
            datasets:[{
                label:"Nyeri IC",
                data:pain,
                borderWidth:2,
                tension:0.3
            }]
        },
        options:{
            responsive:true,
            maintainAspectRatio:false
        }
    });

}
function showWeeklyTrend(){

    const labels = [];
    const pain = [];

    const daily = DB.daily || {};

    Object.keys(daily)
        .sort()
        .slice(-7)
        .forEach(date => {

            labels.push(date.substring(5));

            pain.push(Number(daily[date].ic) || 0);

        });

    drawTrend(labels, pain);

}
function showMonthlyTrend(){

    const labels = [];
    const pain = [];

    const daily = DB.daily || {};

    Object.keys(daily)
        .sort()
        .slice(-30)
        .forEach(date => {

            labels.push(date.substring(5));

            pain.push(Number(daily[date].ic) || 0);

        });

    drawTrend(labels, pain);

}