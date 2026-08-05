// Daily Module

window.DB = window.DB || {};
DB.daily = DB.daily || {};

function loadDaily(date){
    if(!DB.daily[date]){
        DB.daily[date]={
            note:""
        };
    }

    const note=document.getElementById("dailyNote");
    if(note){
        note.value=DB.daily[date].note;
    }
}

function saveCurrentDaily(){
    const date=document.getElementById("dailyDate").value;

    DB.daily[date]={
        note:document.getElementById("dailyNote").value
    };

    if(typeof saveDB==="function"){
        saveDB();
    }

    alert("Catatan berhasil disimpan");
}
