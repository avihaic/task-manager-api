const validator = require('validator')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('../models/Task')
const userSchema = new mongoose.Schema({
        name: {
            type:String,
            trim:true,
            required:true
        },
        email:{
            type:String,
            unique:true,
            trim:true,
            required:true,
            lowercase:true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error('email is invaild');
                }
            }
        },
        age: {
            type:Number
        },
        password:{
            type:String,
            required:true,
            trim:true,
            minlength:7,
            validate(value){
                //.lowercase()
                if(value.toLowerCase().includes('password')){
                    throw new Error('password cant contain the string password')
                }            
            },
        },
        tokens:[{
           token:{
              type:String,
              required:true
           } 
         }],
         avatar:{
            type:Buffer 
         }
},{
    timestamps:true
})

userSchema.virtual('tasks', {
    ref: 'Tasks',
    localField: '_id',
    foreignField: 'owner',
})


userSchema.methods.toJSON = function (){
    const user = this
    const userObject = user.toObject()
    delete userObject.password
  //  delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateauthtoken = async function () {

    const user = this
    const token = jwt.sign({ _id: user._id.toString() },process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

//check user login
userSchema.statics.findbycredentials = async (email,password) => {
    const user = await User.findOne({email})
    if(!user){
        throw new Error('unable to login')
    }

    const ismatch = await bcrypt.compare(password,user.password)
    if(!ismatch){
        throw new Error('unable to login')
    }
    return user
}

//hash the plain text password before sending
userSchema.pre('save', async function(next){
    const user = this

   if(user.isModified('password')){
       user.password = await bcrypt.hash(user.password,8)
   }

    next()
})

//delete user tasks when user is removed
userSchema.pre('remove', async function(next){
    const user = this
    await Task.deleteMany({owner: user._id})
})

const User = mongoose.model('User',userSchema)

module.exports = User