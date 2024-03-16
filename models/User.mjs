import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwtSecret from "../config/jwt.mjs";
import  jwt  from "jsonwebtoken";


const { Schema } = mongoose;


const userSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minLength: 6
    },
    fullName:{
        type: String,
        required: true,
    },
    tokens: {
        default: [],
        type: []
    }
})

userSchema.pre("save", function(next){
    // Is function k this me apko user milega
    const user = this;

     //encryption
     if (user.isModified('password')) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(user.password, salt);
    
        user.password = hash
    }

    //next();  Allow krne k lye ab save krlo
     next()

})
userSchema.methods.comparePassword = function (password) {
    const user = this
    //user.password === db password (encrypted) asjdhu2i346193
    //password === frontend password (normal) 123456
    // console.log('db password', user.password)
    // console.log('frontend password', password)

    return bcrypt.compareSync(password, user.password)
}

userSchema.methods.generateToken = function() {
    const { _id } = this
    const token = jwt.sign({ _id }, jwtSecret);

    return token
}

const user = mongoose.model("User", userSchema);

export default user;