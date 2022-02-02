import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Microlocation= new Schema({
        name:{
            type:String
        },
        city:{
            type:String
        },
        municipality:{
            type:String
        },
        streets:{
            type:Array
        },
        lines:{
            type:Array
        }
        
        
})

export default mongoose.model('Microlocation', Microlocation, 'microlocations');