var express = require('express');
var router = express.Router();
const plm=require('passport-local-mongoose')
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/pinterest')

const Schema = mongoose.Schema;


const userSchema = new Schema({
    userId: { type: String},
    username: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: { type:String
    },
    post:[{type:mongoose.Schema.Types.ObjectId,
        ref:'posts'
        
    }]
})
userSchema.plugin(plm);

module.exports = mongoose.model('user',userSchema);

