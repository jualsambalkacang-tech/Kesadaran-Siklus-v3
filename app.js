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
document.addEventListener("DOMContentLoaded",()=>{

renderPeeHistory();

renderPeeChart();

});
