let mongoose = require("mongoose");

mongoose.Promise = global.Promise;

let postSchema = mongoose.Schema({
    id: {
        type:String,
        required:true
    },
    title:{type:String},
    content:{type:String},
    author:{type:String},
    publishDate:{type:String}
});

let Post = mongoose.model("Post",postSchema);

let PostList = {
    get: function(){
        return Post.find()
        .then(posts=>{
            return posts;
        })
        .catch(error=>{
            throw Error(error);
        });
    },
    getAuthor: function(author){
        return Post.find({author:author})
        .then(posts=>{
            return posts;
        })
        .catch(error=>{
            throw Error(error);
        });
    },
    post: function(newPost){
        return Post.create(newPost)
        .then(post=>{
            return post;
        })
        .catch(error=>{
            throw Error(error);
        });
    },
    delete: function(postId){
        return Post.deleteOne({id:postId})
        .then(post=>{
            if(post["deletedCount"] == 0){
                return 0
            }else{
                return 1
            }
        })
        .catch(error=>{
            throw Error(error);
        })
    },
    update: function(id,newVals){
        return Post.findOneAndUpdate({id:id},newVals,{new:true})
        .then(post=>{
            return post;
        })
        .catch(error=>{
            throw Error(error);
        })
    }
};

module.exports = {PostList};