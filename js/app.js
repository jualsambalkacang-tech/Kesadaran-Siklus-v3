// ==========================================
// Kesadaran Siklus v3 Premium
// Main App
// ==========================================

document.addEventListener("DOMContentLoaded", init);

function init() {

    refreshDashboard();

    bindButtons();

}

// ==========================================
// Dashboard
// ==========================================

function refreshDashboard() {

    document.getElementById("waterToday").textContent =
        getWater();

    document.getElementById("peeCount").textContent =
        getTodayPee().length;

    const bbt =
        DB.bbt[getToday()] || "-";

    document.getElementById("bbtToday").textContent =
        bbt;

    calculateCycle();

}

// ==========================================
// Siklus
// ==========================================

function calculateCycle() {

    if (!DB.profile.lastPeriod) {

        document.getElementById("cycleDay").textContent = "-";

        document.getElementById("cyclePhase").textContent = "-";

        document.getElementById("countdown").textContent = "-";

        return;

    }

    const last =
        new Date(DB.profile.lastPeriod);

    const today =
        new Date();

    const diff =
        Math.floor(
            (today - last) /
            (1000 * 60 * 60 * 24)
        );

    const cycleDay =
        (diff % DB.profile.cycleLength) + 1;

    document.getElementById("cycleDay").textContent =
        cycleDay;

    document.getElementById("cyclePhase").textContent =
        getPhase(cycleDay);

    document.getElementById("countdown").textContent =
        DB.profile.cycleLength - cycleDay;

}

// ==========================================

function getPhase(day) {

    if (day <= 5)
        return "🌸 Menstruasi";

    if (day <= 13)
        return "🌱 Folikular";

    if (day <= 16)
        return "🌼 Ovulasi";

    return "🌙 Luteal";

}

// ==========================================
// Buttons
// ==========================================

function bindButtons() {

    document
        .getElementById("btnWater")
        .addEventListener(
            "click",
            add250ml
        );

    document
        .getElementById("btnPee")
        .addEventListener(
            "click",
            peeNow
        );

}

// ==========================================
// Water
// ==========================================

function add250ml() {

    addWater(250);

    refreshDashboard();

    alert("💧 +250 ml berhasil ditambahkan");

}

// ==========================================
// Bladder Diary
// ==========================================

function peeNow() {

    addPee();

    refreshDashboard();

    alert(
        "🚽 Pipis berhasil dicatat\n\nJam : " +
        new Date().toLocaleTimeString()
    );

}

// ==========================================

console.log("App Ready");
if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker.register("sw.js");

    });

}
function saveCycleProfile(){

DB.profile.lastPeriod=
document.getElementById("lastPeriodInput").value;

DB.profile.cycleLength=
parseInt(
document.getElementById("cycleLengthInput").value
);

DB.profile.periodLength=
parseInt(
document.getElementById("periodLengthInput").value
);

updateDatabase();

refreshDashboard();

if(typeof renderCalendar==="function"){

renderCalendar();

}

alert("Profil siklus berhasil disimpan");

}
function saveCurrentDaily(){

const date=document.getElementById("dailyDate").value;

if(!date){

alert("Pilih tanggal terlebih dahulu");

return;

}

saveDaily(date,{

mood:document.getElementById("dailyMood").value,

energy:document.getElementById("dailyEnergy").value,

ic:document.getElementById("dailyIC").value,

note:document.getElementById("dailyNote").value

});

if(typeof renderCalendar==="function"){

renderCalendar();

}

alert("Catatan berhasil disimpan");

}

function loadDaily(date){

const data=getDaily(date);

document.getElementById("dailyDate").value=date;

if(!data){

document.getElementById("dailyMood").value="";

document.getElementById("dailyEnergy").value="";

document.getElementById("dailyIC").value="";

document.getElementById("dailyNote").value="";

return;

}

document.getElementById("dailyMood").value=data.mood||"";

document.getElementById("dailyEnergy").value=data.energy||"";

document.getElementById("dailyIC").value=data.ic||"";

document.getElementById("dailyNote").value=data.note||"";

}
