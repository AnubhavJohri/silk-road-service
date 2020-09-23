const { Schema  } = require('mongoose');
const Mongoose = require('mongoose');
Mongoose.Promise = global.Promise;
Mongoose.set('useCreateIndex' , true);


//THESE URLS ARE WHERE DATABASE IS STORED
//DONT TOUCH THE URLS
//------------------------------------------------------------------------------------------------------------------
//1.)COSMOS MONGODB URL
//OFFLINE ONLY
//FOR OFFLINE USE AND TESTING
//const url = "mongodb://localhost:27017/SilkRoadDB";
//2.)mLab MONGODB URL
//ONLINE ONLY
//FOR DEPLOYEMENT AND CLOUD USE

const MONGOLAB_URI= "mongodb://heroku_nnd05p0f:d6ssocg9fjk6ea6dtaka13afom@ds243717.mlab.com:43717/heroku_nnd05p0f";
//------------------------------------------------------------------------------------------------------------------


//USER COLLECTION SCHEMA
const userSchema = Schema({
    userId : { type:String , unique:true , required:[true,"User Id is required"] },
    userFirstName : { type:String , require:[true,"First Name is required"]},
    userSecondName : { type:String },
    userMobileNo : { type:String , require:[true,"Mobile Number is required"]},
    userEmailId : { type:String , unique:true , require:[true,"Email Id is required"]},
    userPassword : { type:String , require:[true,"Password is required"]},
    userPosts : [ String ]
} , { collection : "User" , timestamp : true} );


//POST COLLECTION SCHEMA
const postSchema = Schema({
    userId : {type:String,required:[true,'User id is required']},
    postAuthorName:{type:String,required:[true,'Author Name is required']},
    postId:{type:String,required:[true,'post id is required']},
    postTitle : {type:String , required:[true,'post Title is required']},
    postDescription : {type : String , required:[true,'post description is required'] } ,
    post : {type:String , required:[true,'post is required']},
    postLikes:{type:Number, default : 0},
    postComments: [
        {
            commentId : {type : String  } ,
            comment : {type : String},
            commentLikes : {type : Number , default : 0} ,
            commentAuthor : {type : String  } ,
            commentTime : {type : String}
            } ],
    postTime : { type : Date }
} , { collection : "Post" , timestamp : true} );


//process.env.MONGOLAB_URI
//1.)GETS POST OBJECT FROM POST DATABASE
let collection = {};
collection.getUserCollection = () =>{
    //return Mongoose.connect(url , { useNewUrlParser: true })
    return Mongoose.connect( url , { useNewUrlParser: true })
    .then(database =>{
        return database.model('User' , userSchema )
    }).catch(() => {
        let e = new Error();
        e.message = "Could not connect to Database";
        e.status = 500;
        throw e;
    })
}


//2.)GETS POST OBJECT FROM POST DATABASE
collection.getPostCollection = () =>{
    return Mongoose.connect( url , { useNewUrlParser: true })
    .then(database => {
        return database.model( 'Post' ,postSchema )
    })
    .catch( () => {
        let e = new Error();
        e.message = "Could not connect to Database";
        e.status = 500;
        throw e;
    })
}

module.exports = collection;