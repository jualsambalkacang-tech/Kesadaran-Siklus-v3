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
// ======================================
// WATER
// ======================================

function getWater(){

    const date=currentDateKey();

    if(!DB.nutrition[date]){

        DB.nutrition[date]={water:0};

    }

    return DB.nutrition[date].water||0;

}

function addWater(amount){

    const date=currentDateKey();

    if(!DB.nutrition[date]){

        DB.nutrition[date]={water:0};

    }

    DB.nutrition[date].water+=amount;

    saveDB();

}

// ======================================
// PEE DIARY
// ======================================

function getTodayPee(){

    const date=currentDateKey();

    return DB.peeDiary[date]||[];

}

function addPee(){

    const date=currentDateKey();

    if(!DB.peeDiary[date]){

        DB.peeDiary[date]=[];

    }

    DB.peeDiary[date].push({

        time:new Date().toLocaleTimeString([],{

            hour:"2-digit",

            minute:"2-digit"

        })

    });

    saveDB();

}
// ======================================
// DAILY NOTE
// ======================================

function saveDaily(date,data){

    DB.daily[date]={

        ...(DB.daily[date]||{}),

        ...data

    };

    saveDB();

}

function getDaily(date){

    return DB.daily[date]||null;

}

// ======================================
// CYCLE PROFILE
// ======================================

function updateDatabase(){

    saveDB();

}

// ======================================
// BBT
// ======================================

function saveBBT(value){

    const date=currentDateKey();

    if(!DB.daily[date]){

        DB.daily[date]={};

    }

    DB.daily[date].bbt=value;

    saveDB();

}

function getBBT(date){

    return DB.daily[date]?.bbt||"";

}
// ======================================
// MEDICATION
// ======================================

function saveMedication(data){

    const date=currentDateKey();

    if(!DB.medication[date]){

        DB.medication[date]=[];

    }

    DB.medication[date].push(data);

    saveDB();

}

function getMedication(date){

    return DB.medication[date]||[];

}

// ======================================
// TODO
// ======================================

function saveTodo(text){

    const date=currentDateKey();

    if(!DB.todo[date]){

        DB.todo[date]=[];

    }

    DB.todo[date].push({

        text:text,

        done:false

    });

    saveDB();

}

function getTodo(date){

    return DB.todo[date]||[];

}

function toggleTodo(date,index){

    if(!DB.todo[date]) return;

    DB.todo[date][index].done=!DB.todo[date][index].done;

    saveDB();

}
// ======================================
// NUTRITION
// ======================================

function saveFood(food){

    const date=currentDateKey();

    if(!DB.nutrition[date]){

        DB.nutrition[date]={};

    }

    DB.nutrition[date].food=food;

    saveDB();

}

function getFood(date){

    return DB.nutrition[date]?.food||"";

}

// ======================================
// MOOD
// ======================================

function saveMood(mood){

    const date=currentDateKey();

    if(!DB.daily[date]){

        DB.daily[date]={};

    }

    DB.daily[date].mood=mood;

    saveDB();

}

function getMood(date){

    return DB.daily[date]?.mood||"";

}

// ======================================
// HELPER
// ======================================

function ensureDaily(date){

    if(!DB.daily[date]){

        DB.daily[date]={};

    }

    return DB.daily[date];

}

function ensureNutrition(date){

    if(!DB.nutrition[date]){

        DB.nutrition[date]={};

    }

    return DB.nutrition[date];

}
