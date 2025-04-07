if(process.env.NODE_ENV != "production"){
require('dotenv').config()
}
// console.log(process.env.SECRET)
const express =require("express");
const app = express();
const mongoose =require("mongoose");
// const Listing =require("./models/listing.js")
const path=require("path");
const methodoverride = require("method-override")
const ejsMate = require("ejs-mate")
// const wrapAsync = require("./util/wrapAsync.js")
const ExpressError =require("./util/ExpressError.js");
// const Joi = require("joi");  
// const {listingSchema , reviewSchema} = require ("./schema.js")
const Review =require("./models/review.js")
const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")
const session = require("express-session")
const MongoStore=require("connect-mongo")
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")


app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride("_method"));
app.engine('ejs',ejsMate)
app.use(express.static(path.join(__dirname,"/public")))

// const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlist";
const dbUrl=process.env.ATLAS_DB_URL;
main().then(() =>{
    console.log("Connected...");
}).catch((err) =>{
    console.log(err);
})

async function main() {
    await mongoose.connect(dbUrl);
}

const store =MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
    secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})

store.on("error",() =>{
    console.log("Error in Mongo Session Store",err)
})
const sessionOption ={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}



app.use(session(sessionOption))
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next) =>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser=req.user;
    res.locals.redirectUrl=req.session.redirectUrl
    next();
})

// app.get("/demouser",async (req,res) =>{
//     let fakeUser= new User({
//         email:"student@gmail.com",
//         username:"delta-student",
//     })

//     let registerUser = await User.register(fakeUser,"helloWorld");
//     res.send(registerUser)
// })

app.get("/",(req,res) =>{
    res.redirect("/listings")
})

app.listen(8080, () =>{
    console.log("App is listening");
})

app.use("/listings",listingRouter)
app.use("/listings/:id/reviews",reviewRouter)
app.use("/",userRouter)

//review
//post route



app.all("*",(req,res,next) =>{
    next(new ExpressError(404,"Page NOt Found!!!"))
})

app.use((err,req,res,next) =>{
    let {status=500,message="Somthing went Wrong"} =err;
    // res.send("Somthing went Wrong");
    // res.status(status).send(message);
    res.status(status).render("error.ejs",{message})
})
