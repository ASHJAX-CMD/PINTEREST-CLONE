// const mongoose=require('mongoose');
// const { stringify } = require('uuid');

// const postSchema= new mongoose.Schema({
//     postText:{
//         type: String,
//         required:true,
//     },

//     image:{
//         type:String,
//     },

//     user:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:'User',
//     }
// })

// const Post = mongoose.model('Post', postSchema);

// module.exports = Post;

const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    postText: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, // Adding required true to ensure every post is associated with a user
    }
}, {
    timestamps: true // This will add createdAt and updatedAt timestamps automatically
});



let PostModel;

try {
  
  PostModel = mongoose.model('Post', PostSchema);
  module.exports = PostModel;
} catch (error) {
 console.log(error)
} 




