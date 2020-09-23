const collection = require('../utilities/connection');
let PostModel = {};

//0.)
//UNIQUE USER-ID GENERATE FUNCTIONALITY
//Generates new unique user-id for every new User
PostModel.generatePostId = () =>{
    return collection.getPostCollection().then(user => {
        return user.find({},{ postId:1 , _id:0 }).sort( { postId : -1} ).limit( 1 ).then(postId => {
            //console.log("userId=" , postId);
            let pid = "";    
            if( postId.length== 0 )
            pid = "P1001" ;
            else if(postId.length>0)
            {
                pid = postId[0].postId;
                pid = parseInt(pid.substring(1));
                pid = pid+1;
                pid = "P"+pid;
                //console.log("new pid=",pid);
            }
            //console.log("pid=" , pid);
            return pid;
        })
    })
}

//0.)
//UNIQUE COMMENT-ID GENERATE FUNCTIONALITY
//Generates new unique comment-id for every new User
PostModel.generatePostCommentId = ( userId , postId ) =>{
    //console.log("userId=",userId,postId);
    return collection.getPostCollection().then(post=>{
        return post.aggregate( [ {$match : {userId : userId,postId : postId}} ,{$project:{postComments:1,_id:0}},  {$unwind : "$postComments"}, {$sort : {"postComments.commentId":-1}},{$limit:1}]).then(commentId => {
            console.log("aggregate query result=",commentId[0].postComments.commentId);
            let cId = "" ;
            if(commentId.length==0)
            cId = "100001" ;
            else{
                cId = commentId[0].postComments.commentId.substring(1);
                cId = parseInt(cId);
                cId = cId + 1;
            }
            console.log("new commentId = " , "C"+cId);
            return "C"+cId ;
        })
    })

}
//1.)
//ADD NEW POST FUNCTIONALITY
//Adds New Post Document to the Post Collection in SilkRoadDb
PostModel.addPost = ( post ) =>{
    return collection.getPostCollection().then( db => {
        return PostModel.generatePostId().then( postId => {
            post.postId = postId ;
            //console.log("post object inserted=",post);
            return db.insertMany(post).then( data => {
                //console.log("result=",data);
                if(data.length == 0)
                return 1;
                else
                {
                    return collection.getUserCollection().then( userdb => {
                        return userdb.updateOne( { userId : post.userId } ,{ $push : { "userPosts" : postId }} ).then( updateResult => {
                            if(updateResult.nModified>0)
                             return postId;
                             else
                             return  2;
                        })
                    })
                }   
            })
        })
    })
}


//2.)
//FUNCTIONALITY TO GET ALL THE POSTS IN POST COLLECTION 
//Get all the posts to display on the home page of website
PostModel.getAllPosts = () =>{
    return collection.getPostCollection().then( db => {
        return db.find({},{_id : 0}).sort( { postTime : -1 } ).then( posts => {
            if( posts.length > 0 )
            return posts;
            else
            null; 
        })
    })
}



//3.)
//FUNCTIONALITY TO GET POSTS OF A PARTICULAR USER ONLY
//Gets all the posts of a particular User
PostModel.getUserPosts = ( userId ) => {
    return  collection.getPostCollection().then( db => {
        return db.find( { userId : userId } , { _id : 0 } ).then( res => {
            if ( res.length >0 )
            return res;
            else
            return null;
        })
    })                       

}


//4.)
//FUNCTIONALITY TO DELETE POST OF A UNIQUE POSTID
PostModel.deleteUserPost = ( postId , userId ) => {

    return collection.getUserCollection().then( user => {
        return user.updateOne ( { userId : userId } , { $pull : { userPosts : postId } } ).then( user_res =>{
            //console.log("postid deleted with object " , user_res)
            if ( user_res.nModified > 0 )
            { 
                return collection.getPostCollection().then( post => {
                    return post.deleteOne({postId : postId}).then( data =>{
                        //console.log("postid deleted=" , data.deletedCount);
                        if(data.deletedCount > 0){
                            return postId;
                        }
                        else{
                            return null;
                        }
                    })
                })
            }
            else
            return 1;
        } )
    })
}

//5.)
//FUNCTIONALITY TO ADD COMMENT
PostModel.addPostComment = ( comment , userId ,postId) =>{
    return PostModel.generatePostCommentId( userId,postId ).then(commentId => {
        return collection.getPostCollection().then( postDb => {
            comment.commentId = commentId ;
            console.log("comment being added=",comment,userId);            
            return postDb.updateOne( { $and:[ { userId : userId } , { postId : postId } ]  } , { $push : {postComments : comment} } ).then( res=> {
                if ( res.nModified>0 )
                return commentId ;
                else
                null ;
            })
        } ) 
    })

}

module.exports = PostModel;


// db.User.find().pretty()
//db.User.update( { userId : "U1001" } ,{ $pull : { userPosts : "P1001"} } )
// db.Post.find( { $and : [ {userId : "U1003" } , {postId : "P1001" } ] } , { _id:0 , postComments :1 } ).sort({"postComments.commentId":-1})
// db.Post.aggregate( [ $match : {$and:[{userId : "U1003"},{postId : "P1001"}] } ] );
//db.Post.aggregate( [ {$match : {userId : "U1005",postId : "P1004"}} ,{ $project : {_id:0 , postComments:1}},  {$unwind : "$postComments"}, {$sort : {"postComments.commentId":-1}}]).pretty()