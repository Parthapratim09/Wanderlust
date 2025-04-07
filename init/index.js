const mongoose =require("mongoose")
const initdata = require("./data.js")
const Listing = require("../models/listing.js")
// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlist"


const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlist";
main().then(() =>{
    console.log("Connected...");
}).catch((err) =>{
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB= async () =>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({...obj,owner:"67d2fae4c0023d3668a6118d"}))
    await Listing.insertMany(initdata.data);
    console.log("Data was initialized")
};

initDB();