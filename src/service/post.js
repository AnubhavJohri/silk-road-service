const PostModel = require('../model/post');

let PostService = {};


//1.)
//ADD NEW POST FUNCTIONALITY
//Calls Post Model File to add new post to the database
PostService.addPost = ( post ) =>{
    return PostModel.addPost( post ).then( result => {
        //console.log("in service=", result);
        let e = new Error();
        if(result==1){
            e.message = "Something went wrong! Post Didn't Add";
            e.status = 501;
            throw e;
        }
        else if(result == 2){
            e.message = "Post added to database but Post Id didn't add in User account . Reason can be that The userId in Post object doesn't exist.";
            e.status = 502;
            throw e;
        }
       else(result)
       return result;
    });
}


//2.)
//FUNCTIONALITY TO GET ALL THE POSTS IN POST COLLECTION 
//Get all the posts to display on the home page of website
PostService.getAllPosts = () => {
    return PostModel.getAllPosts().then( res => {
        if( res )
        return res;
        else{
            let e = new Error();
            e.message = "Something went wrong , Please Try after some time";
            e.status = 500 ;
            throw e;
        }
    })
}


//3.)
//FUNCTIONALITY TO GET POSTS OF A PARTICULAR USER ONLY
//Gets all the posts of a particular User
PostService.getUserPosts = (  userId ) => {
    return PostModel.getUserPosts( userId ).then( res => {
        if( res )
        return res;
        else{
            let e = new Error();
            e.message = "Something went wrong , Please Try after some time . Maybe the userId you tried isn't registered!";
            e.status = 500 ;
            throw e;
        }
    })
}


//4.)
//FUNCTIONALITY TO DELETE POST OF A UNIQUE POSTID
PostService.deleteUserPost = ( postId , userId ) => {
    return PostModel.deleteUserPost( postId , userId ).then( data =>{
        //CONDITION 1
        //TRUE WHEN USERID DOESN'T HAVE POSTID CLIENT IS REQUESTING TO DELETE
        //AUTHENTICATES WHETHER USER WHOSE TRYING TO DELETE THE POST HAS WRITTEN THE POST
        if ( data == 1){
            let e = new Error();
            e.message = "Unauthorized Access , Post doesn't belong to the User trying to delete it! or PostId is wrong";
            e.status = 404;
            throw e;
        }
        //CONDITION 2
        //TRUE WHEN POST HAS BEEN SUCCESSFULLY DELETED
        else if( data )
        return data;
        //CONDITION 3
        //TRUE WHEN USER HAS BEEN AUTHENTICATED BUT POST HAS BEEN DELETED
        //REASON CAN BE BECAUSE PROVIDED POST-ID IS WRONG
        else{
            let e = new Error();
            e.message = "Unable to delete the post.Provided PostId might be wrong OR internal server error!";
            e.status = 502;
            throw e;
        }
    })
}


//5.)
//FUNCTIONALITY TO ADD A COMMENT BELOW A POST
PostService.addPostComment = ( comment , userId,postId ) =>{
    return PostModel.addPostComment( comment , userId ,postId).then( data => {
        if(data)
        return data ;
        else
        {
            let e = new Error();
            e.message = "Something went wrong! Couldn't add your comment!";
            e.status = 502 ;
            throw e ;
        }
    } )
}


module.exports = PostService;