//Deals with Post Collection in Silk RoadDB

class PostData  {
    constructor(post){
        this.userId = post.userId ,
        this.postId = "" ,
        this.postTitle = post.postTitle.trim() ,
        this.postDescription = post.postDescription.trim() ,
        this.post = post.post.trim(),
        this.postAuthorName = post.postAuthorName.trim() ,
        this.postLikes = post.postLikes ,
        this.postComments = post.postComments ,
        this.postTime = new Date().toLocaleString()
    }
}

module.exports = PostData


