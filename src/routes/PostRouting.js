const express = require('express');
const routing = express.Router();
const PostData = require('../model/PostData');
const PostService = require('../service/post');


//0.)
//DUMMY ROUTE JUST TO CHECK WHETHER ROUTES ARE WORKING
routing.get('/' , (req ,res, next) => {
    res.json({ "message" : "Post Route working fine too Sir!"});
})

//1.)
//ADDS POST TO BOTH USER DATA AND POSTS DATABASE
routing.post ( '/addpost' , ( req ,  res , next ) =>{
    const userId = req.body.userId ;
    const post = req.body;
    //console.log("request date=", dt.toLocaleDateString() , dt.toLocaleString() ,new Date(dt.toLocaleString()));
    const postObject = new PostData( post );
    PostService.addPost( postObject )
    .then( postId => {
        res.json({"message" : `Post added with Post Id ${ postId }`});
    })
    .catch(err => {
        next(err);
    })
    //res.json("AddPost Option Comming Super SOOOONN!!!");
} )

//2.)
//FUNCTIONALITY TO GET ALL THE POSTS IN POST COLLECTION 
//Get all the posts to display on the home page of website
routing.get( '/getallposts' , (req , res , next) => {
    PostService.getAllPosts().then( posts => {
        res.json( { "data" : posts } );
    }).catch( err => next(err) );
})

//3.)
//FUNCTIONALITY TO GET PARTICULAR USER POSTS ONLY
routing.get( '/getuserposts/:userId' , (req , res , next) => {
    const userId = req.params.userId ; 
    PostService.getUserPosts( userId ).then( posts => {
        res.json( { "data" : posts } );
    }).catch( err => next(err) );
})


//4.)
//FUNCTIONALITY TO DELETE A PARTICULAR POST
//We don't need userId 
//We could have managed to generate userId from backend
//But , then anyone could anonymously interact with server 
//and could have deleted anyone else's post
//We don't want that to happen
//Asking for userId is kind of doing authentication while deleting the post
//If provided postId isn't of particular user the deletion process will be deleted
routing.delete ( '/deletepost/:postId/:userId' , (req , res , next) => {
    console.log("hit",req.params.postId,req.params.userId);
    PostService.deleteUserPost( req.params.postId , req.params.userId )
    .then( postId => {
        res.json( { "message" : `Post with PostId ${postId} is deleted successfully!` } );
    })
    .catch( err => next(err));
})

//5.)
//FUNCTIONALITY TO ADD NEW COMMENT TO GIVEN POST
routing.post ('/addPostComment' , (req,res,next) => {
    const userId = req.body.userId ; 
    const postId = req.body.postId ; 
    let time ="";
    time = new Date().toLocaleString()
    let comment={};
    comment["commentId"]="";
    comment["comment"]=req.body.comment;
    comment["commentLikes"]=req.body.commentLikes;
    comment["commentAuthor"]=req.body.commentAuthor;
    comment["commentTime"]= time;
    //console.log("comment submitting=",comment,userId,postId);
    PostService.addPostComment( comment , userId ,postId ).then( result => {
        res.json({ "message" : `Comment with commentId ${result} has been successfully added! ` });
    }).catch( err => next(err));
} )
//Dummy Post Object
// {
//     "userId" : "U1001"  ,
//     "postTitle" : "First Post",
//     "post" : "This is my first Post Ever!!" ,
//     "postDescription" : "Noob Post"  ,
//     "postAuthorName" :  "Anonymous",
//     "postLikes" :  "2",
//     "postComments" :  [],
//     "postTime" : ""
// }

// {
//     "userId" : "U1003",
//     "postId" : "P1001",
//     "comment" : "Great Comment!",
//     "commentAuthor" : "Bruce Wayne",
//     "commentLikes" : 0,
// }


module.exports = routing;