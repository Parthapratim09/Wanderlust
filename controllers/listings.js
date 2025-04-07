const Listing = require("../models/listing")
const Review = require("../models/review");

module.exports.index=async (req,res) =>{
    const allListings =await Listing.find({});
    res.render("listings/index.ejs",{allListings})
}

module.exports.renderNewForm =(req,res) =>{
    
    res.render("listings/new.ejs")
}

module.exports.showListing =async (req,res) =>{
    let {id} =req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!")
        res.redirect("/listings")
    }
    res.render("listings/show.ejs",{listing})
}

module.exports.renderEditForm = async(req,res) =>{
    let {id} =req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250")
    res.render("listings/edit.ejs",{listing})
    // res.send("helloo")

}

module.exports.updateListing =async(req,res) =>{
    let {id} = req.params;

    let listing =await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url=req.file.path
        let filename = req.file.filename
        listing.image={url,filename}
        await listing.save();
    }
   
    req.flash("success","Item Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.addNewListing = async(req,res,next) =>{
    // let listing =req.body.listing;
    // console.log(listing)

    // const newListing =new Listing(req.body.listing);
    // await newListing.save().then((result) =>{
    //     console.log(result);
    //     res.redirect("/listings");
    // }).catch((err) =>{
    //     res.send("Some error in Saving Data");
    // })
    // try{
    // const newListing =new Listing(req.body.listing);
    // await newListing.save();
    // res.redirect("/listings");
    // }catch(err){
    //     next(err);
    // }

    let url=req.file.path
    let filename = req.file.filename
    // console.log(url,"..",filename)
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid Data")
    }
    const newListing =new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image={url,filename}
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}

module.exports.deleteListing = async(req,res) =>{
    let {id} = req.params;
    // let listing = await Listing.findById(id);
    // if(!listing.owner._id.equals(currUser._id)){
    //     req.flash("error","You don't Have permission to Delete")
    //     return res.redirect(`/listings/${id}`);
    // }

    let deleteListing = await Listing.findByIdAndDelete(id);
    // console.log(review)
    await Review.deleteMany({_id :{$in: deleteListing.reviews }})
    
    console.log(deleteListing);
    req.flash("success","Item Deleted!");
    res.redirect("/listings")
}