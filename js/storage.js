const DB = JSON.parse(localStorage.getItem("cycleDB")) || {

    profile: {},

    daily: {},

    peeDiary: {},

    medication: {},

    nutrition: {},

    todo: {},

    settings: {}

};

function saveDB(){

    localStorage.setItem(

        "cycleDB",

        JSON.stringify(DB)

    );

}

function currentDateKey(){

    const d = new Date();

    const y = d.getFullYear();

    const m = String(d.getMonth()+1).padStart(2,"0");

    const day = String(d.getDate()).padStart(2,"0");

    return `${y}-${m}-${day}`;

}
