const express = require("express")
const router=express.Router()
const Listing =require("../models/listing.js")
const wrapAsync = require("../util/wrapAsync.js")

const review = require("../models/review.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js")
const listingController = require("../controllers/listings.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({storage})


router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.addNewListing))
    // .post( upload.single('listing[image][url]'),(req,res) =>{
    //     res.send(req.body)
    // })
    // .post(, (req, res) => {
    // console.log("Received form data:", req.body);
    // console.log("Uploaded file:", req.file);
    // if (!req.file) {
    //     console.log("No file received.");
    //     return res.status(400).send("File upload failed.");
    // }
    // res.send(req.file);
    // });


// create
router.get("/new",isLoggedIn,listingController.renderNewForm)

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing))









//index route



// router.get("/",wrapAsync(listingController.index))



// show route

// router.get("/:id", wrapAsync(listingController.showListing))
//create
// router.get("/new",isLoggedIn, (req,res) =>{
//     res.render("listings/new.ejs")
// })

// router.post("/",validateListing,wrapAsync(listingController.addNewListing))

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))

//update
// router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing))

//delete
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.deleteListing))

module.exports=router