const Listing = require("./models/listing")
const Review = require("./models/review")
const ExpressError =require("./util/ExpressError.js");
const {listingSchema,reviewSchema} = require ("./schema.js")

module.exports.isLoggedIn= (req,res,next) =>{
    console.log(req.path,"..",req.originalUrl)
   
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You Must be logged in to create the listing!")
        return res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next) =>{
    console.log(req.session.redirectUrl)
    res.locals.redirectUrl=req.session.redirectUrl
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl
        // console.log("under savereidrecturl")
        // console.log(res.locals.redirectUrl)
        // delete req.session.redirectUrl
    }
    next()
}

module.exports.isOwner = async(req,res,next) =>{
    let {id} = req.params
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You don't Have permission to Edit")
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next) =>{
    let {error} =listingSchema.validate(req.body);
    // console.log(result)

    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        next(new ExpressError(400,errMsg))
    }
    else {
        next();
    }
}

module.exports.validateReview = (req,res,next) =>{
    let {error} =reviewSchema.validate(req.body);
    // console.log(result)

    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        next( new ExpressError(400,errMsg))
    }
    else {
        next();
    }
}

module.exports.isReviewAuthor = async (req,res,next) =>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId)
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","your are not author of this review")
        return res.redirect(`/listings/${id}`)
    }
    else
    {
        next();
    }
}