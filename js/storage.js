// ==========================================
// Kesadaran Siklus v3 Premium
// Storage Manager
// ==========================================

const STORAGE_KEY = "kesadaran_siklus_v3";

// Struktur database
const defaultData = {
  profile: {
    cycleLength: 28,
    periodLength: 5,
    lastPeriod: ""
  },

  dashboard: {},

  daily: {},

  bladder: {},

  bbt: {},

  medication: {},

  water: {},

  todo: {},

  nutrition: {},

  reflection: {},

  settings: {
    theme: "light",
    targetWater: 2000
  }
};

// -----------------------------

function loadData() {

  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {

    saveData(defaultData);

    return structuredClone(defaultData);

  }

  try {

    return JSON.parse(raw);

  }

  catch (e) {

    console.error(e);

    saveData(defaultData);

    return structuredClone(defaultData);

  }

}

// -----------------------------

function saveData(data) {

  localStorage.setItem(

    STORAGE_KEY,

    JSON.stringify(data)

  );

}

// -----------------------------

let DB = loadData();

// -----------------------------

function updateDatabase(){

  saveData(DB);

}

// ==========================================
// Daily
// ==========================================

function saveDaily(date,data){

  DB.daily[date]=data;

  updateDatabase();

}

function getDaily(date){

  return DB.daily[date] || null;

}

// ==========================================
// Water
// ==========================================

function addWater(amount){

  const today=getToday();

  if(!DB.water[today]){

      DB.water[today]=0;

  }

  DB.water[today]+=amount;

  updateDatabase();

}

function getWater(){

   const today=getToday();

   return DB.water[today] || 0;

}

// ==========================================
// Bladder Diary
// ==========================================

function addPee(data={}){

    const today=getToday();

    if(!DB.bladder[today]){

        DB.bladder[today]=[];

    }

    DB.bladder[today].push({

        time:new Date().toLocaleTimeString(),

        pain:data.pain||0,

        urgency:data.urgency||"",

        volume:data.volume||"",

        notes:data.notes||""

    });

    updateDatabase();

}

function getTodayPee(){

   const today=getToday();

   return DB.bladder[today] || [];

}

// ==========================================
// Medication
// ==========================================

function saveMedication(item){

    const id=Date.now();

    DB.medication[id]=item;

    updateDatabase();

}

// ==========================================
// Todo
// ==========================================

function saveTodo(item){

    const id=Date.now();

    DB.todo[id]=item;

    updateDatabase();

}

// ==========================================
// BBT
// ==========================================

function saveBBT(temp){

   DB.bbt[getToday()]=temp;

   updateDatabase();

}

// ==========================================
// Nutrition
// ==========================================

function saveNutrition(item){

   DB.nutrition[getToday()]=item;

   updateDatabase();

}

// ==========================================
// Reflection
// ==========================================

function saveReflection(text){

   DB.reflection[getToday()]=text;

   updateDatabase();

}

// ==========================================

function getToday(){

   return new Date().toISOString().split("T")[0];

}

// ==========================================

console.log("Storage Ready");
