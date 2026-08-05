// ====================================
// Kesadaran Siklus v3
// Daily Module
// ====================================

function saveCurrentDaily(){

    const date = document.getElementById("dailyDate").value;

    if(!date){
        alert("Pilih tanggal terlebih dahulu.");
        return;
    }

    if(!DB.daily){
        DB.daily = {};
    }

    DB.daily[date] = {

        mood: document.getElementById("dailyMood").value,

        energy: document.getElementById("dailyEnergy").value,

        ic: document.getElementById("dailyIC").value,

        note: document.getElementById("dailyNote").value

    };

    saveDB();

    alert("Catatan berhasil disimpan.");

    if(typeof renderCalendar==="function"){
        renderCalendar();
    }

}
