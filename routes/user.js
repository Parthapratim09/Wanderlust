const express = require("express")
const router=express.Router()
const wrapAsync = require("../util/wrapAsync")
const passport = require("passport"); 
const { saveRedirectUrl } = require("../middleware.js");
const userController  = require("../controllers/user.js");



router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signupForm))

router.route("/login")
.get(userController.renderLoginForm)
.post(
    saveRedirectUrl,
    passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
    }),userController.login
)
// router.get("/signup",userController.renderSignupForm)

// router.post("/signup",wrapAsync(userController.signupForm))

// router.get("/login",userController.renderLoginForm)

// router.post("/login",passport.authenticate("local",{failurRedirect: '/login',failureFlash:true}), async(req,res) =>{
// res.send("welcome to wanderlist")
// })

// router.post(
//     "/login",
//     saveRedirectUrl,
//     passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//     }),userController.login
// )

router.get("/logout",userController.logout)

module.exports=router