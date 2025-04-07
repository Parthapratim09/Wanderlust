const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const Review =require("./review.js")

const listingSchema = new Schema({
    title:
    {type:String,
        required:true
    },

    description:String,
    image:{
    // {type:String,
    //     default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.investindia.gov.in%2Fteam-india-blogs%2Ftourism-discovering-top-5-tourist-destinations-india-journey-through-beauty-and&psig=AOvVaw2rn7k9Yn87cqI_2ob3Ohpb&ust=1739847901224000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCIDf4tHcyYsDFQAAAAAdAAAAABAJ",
    //     set:(v) => v ==="" ? "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.investindia.gov.in%2Fteam-india-blogs%2Ftourism-discovering-top-5-tourist-destinations-india-journey-through-beauty-and&psig=AOvVaw2rn7k9Yn87cqI_2ob3Ohpb&ust=1739847901224000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCIDf4tHcyYsDFQAAAAAdAAAAABAJ" : v,
    filename:{
        type:String,
    },
    url:{
        type:String,
        default:"https://www.oyorooms.com/travel-guide/wp-content/uploads/2019/01/Victoria-Memorial.jpg",
        set:(v) => v ==="" ? "https://www.oyorooms.com/travel-guide/wp-content/uploads/2019/01/Victoria-Memorial.jpg" : v,
    }
    },
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true},
    country:{
        type:String,
        required:true},
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    coordinates:{
        lon:{
            type:Number
        },
        lat:{
            type:Number
        }
    }
});

// listingSchema.post("findOneAndDelete",async(listing) =>{
//     if(listing){
//         await Review.deleteMany({_id :{$in: listing.reviews }})
//     }
// })


const Listing = mongoose.model("Listing",listingSchema)
module.exports =Listing;