import mongoose from 'mongoose';
import validator from 'validator';
const registerSchema = new mongoose.Schema({
    firstname:{
        type:String, 
        required:[true, "Enter last name"],
        maxlength:[30,"name cannot exceed 30 character"],
        minlength:[3,"name should be atleast 3 character"] 
    },
    lastname:{
        type:String,
        required:[true, "Enter last name"],
        maxlength:[30,"name cannot exceed 30 character"],
        minlength:[3,"name should be atleast 3 character"] 
    },
    email:{
        type:String,
        required:[true, "enter email"],
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    password:{
        type:String,
        required: [true, "enter  your password"],
        minlength: [8, "password should be greater than 8 character"]
    },
    profile:{
        type: String
    }
})
export default mongoose.model("user",registerSchema)

