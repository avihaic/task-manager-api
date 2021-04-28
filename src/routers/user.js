const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const auth = require('../middelware/auth')
const multer = require('multer')
const sharp = require('sharp')
const {sendwelcomemail,senddeletemail} = require('../emails/account')
const { find } = require('../models/user')

/*Create User */
router.post('/users', async (req, res) =>{
    const user = new User(req.body)
    try {
        await user.save()
        sendwelcomemail(user.email, user.name)
        const token = await user.generateauthtoken()
        res.status(200).send({user,token})
    } catch (e) {
        res.status(400).send(e)
    }
})

//login user
router.post('/users/login', async (req,res) => {
try {
    const user = await User.findbycredentials(req.body.email, req.body.password)
    const token = await user.generateauthtoken()
    res.send({user,token})
    } catch (e) {
        res.status(400).send('cant login')
    }
})

//user logout
router.post('/users/logout', auth , async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
           return token.token !== req.token
        })     
       await req.user.save()
       res.send('you are logout')

    } catch (e) {
        res.status(500).send(e)
    }
})

//logoutall
router.post('/users/logoutall', auth ,async (req,res) =>{
    try {
        req.user.tokens = []
        await req.user.save()
        res.send("you logout from all tokens")

    } catch (e) {
        res.send('somting worngs')
    }
})

//show my profile
router.get('/users/me', auth ,async (req,res) => {
res.send(req.user)
})

//show all user
router.get('/users' , async (req,res) => {
    try {
        const users = await User.find({});
        console.log('aaaaaa',users)
        res.send(users)
    } catch (e) {
        res.send('no user')
    }
    })

//update user
router.patch('/users/me', auth , async (req,res) =>{

    const updates = Object.keys(req.body)
    const allowedupdates = ['name','email','password','age']
    const isvalidoperation = updates.every((update) => allowedupdates.includes(update))
    
    if(!isvalidoperation){
        return res.status(400).send({error: 'invaild updates!!!'})
    }

    try {        
        updates.forEach((update) =>{
            req.user[update] = req.body[update]
        })
        await req.user.save()
        res.status(200).send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

//delete user
router.delete('/users/me', auth , async (req,res) =>{
    try {
        await req.user.remove()
        senddeletemail(req.user.email,req.user.name)
        res.status(200).send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

//upload files
const upload = multer({
    limits:{
    fileSize: 1000000
    },
    fileFilter(req,file,cb)
    {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('file must be a jpg|jpeg|png'))
        }
        cb(undefined,true)
    }
})

router.post('/users/me/avatar',auth ,upload.single('avatar'), async (req,res) => {
   const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
   req.user.avatar = buffer
   await req.user.save()
    res.send('file upload ok')
},(error, req, res, next) => {
    res.status(400).send({ error: error.message})
})

//delete avatar
router.delete('/users/me/avatar',auth , async (req,res) => {
    req.user.avatar = undefined
    await req.user.save()
     res.send('avatar deleted')
 },(error, req, res, next) => {
     res.status(400).send({ error: 'error delete avatar'})
 })

 router.get('/users/avatar/:id', async (req,res) =>{
     try {
         const user = await User.findById(req.params.id)
         if(!user || !user.avatar){
             throw new Error()
         }
         res.set('Content-Type', 'image/png')
         res.send(user.avatar)
     } catch (error) {
         res.status(400).send()
     }
 })
module.exports = router