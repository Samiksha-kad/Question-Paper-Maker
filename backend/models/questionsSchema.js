import mongoose from 'mongoose';
import validator from 'validator';
const questionsSchema = new mongoose.Schema({
    subjectName:{
        type:String,
        required:true
    }, 
    Paper:{
        type:Array, 
        required:true
    },
    marks:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:[true, "enter email"],
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    flag:{
        type:Number,
        default:1
    }
})
export default mongoose.model("question",questionsSchema)