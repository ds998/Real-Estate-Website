import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Real_Estate= new Schema({
        name:{
            type:String
        },
        microlocation:{
            type:String
        },
        street:{
            type:String
        },
        area:{
            type:Number
        },
        lines:{
            type:Array
        },
        type:{
            type:String
        },
        rooms:{
            type:Number
        },
        construction_year:{
            type:Number
        },
        state:{
            type:String
        },
        heating:{
            type:String
        },
        floor:{
            type:Number
        },
        total_floors:{
            type:Number
        },
        parking:{
            type:String
        },
        monthly_utilities:{
            type:Number
        },
        price:{
            type:Number
        },
        about:{
            type:String
        },
        characteristics:{
            type:Array
        },
        advertiser:{
            type:Object
        },
        pictures:{
            type:Array
        },
        selling_month:{
            type:Number
        },
        change_time:{
            type:Date
        }
        
        
})

export default mongoose.model('Real_Estate', Real_Estate, 'real_estates');