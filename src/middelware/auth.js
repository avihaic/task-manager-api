const jwt = require('jsonwebtoken')
const User = require('../models/user')
require('mongoose')
const auth = async (req,res,next) => {
    try {
            const token = req.header('Authorization').replace('Bearer ', '')
            //const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const decoded = jwt.verify(token, 'blabal')
            const user = await User.findOne({ _id: decoded._id, 'tokens.token': token})

            if(!user){
                res.status(404).send('no user')
            }

            req.token = token
            req.user = user
            next()
        } catch (e) {
            res.status(404).send('please Authenticate')
        }

}

module.exports = auth
