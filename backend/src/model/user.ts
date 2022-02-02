import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let User= new Schema({
        name:{
            type:String
        },
        surname:{
            type:String
        },
        username:{
            type:String,
        },
        password:{
            type:String,
        },
        type:{
            type:String,
        },
        city:{
            type:String
        },
        birthday:{
            type:Date
        },
        email:{
            type:String
        },
        phone:{
            type:String
        },
        agency:{
            type:String
        },
        licence:{
            type:Number
        },
        favorites:{
            type:Array
        },
        approved:{
            type:Number
        },
        picture:{
            type:String
        }
})

export default mongoose.model('User', User, 'users');