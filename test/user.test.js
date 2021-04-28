const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const mongoose = require('mongoose')
const { JsonWebTokenError } = require('jsonwebtoken')
const jwt = require('jsonwebtoken')
const { findById } = require('../src/models/user')
const useroneid = new mongoose.Types.ObjectId()

const userone = {
    _id:useroneid,
    name:'gal1',
    email:'gal1@gmail.com',
    password:'12345678',
    tokens:[{
        token: jwt.sign({_id:useroneid}, process.env.JWT_SECRET)
    }]
}

beforeEach(async () => {
await User.deleteMany()
await new User(userone).save()
})

 test('should singup a new user', async () =>{
  const res = await request(app).post('/users').send({
        name:'mor',
        email:'mor@gmail.com',
        password:'12345678'
    }).expect(200)

    const user = await User.findById(res.body.user._id)
    expect(user).not.toBeNull()

    expect(res.body).toMatchObject({
        user:{
            name:'mor',
            email:'mor@gmail.com'
        },
        token:user.tokens[0].token
    })
    expect(user.password).not.toBe('1234567')
})

test('should login user', async () =>{
  const res = await request(app).post('/users/login').send({
        email:userone.email,
        password:userone.password
    }).expect(200)

    const user = await User.findById(res.body.user._id)
    expect(user.tokens[1].token).toBe(res.body.token)
})

test('should not login no user', async () =>{
    await request(app).post('/users/login').send({
        email:'aaa@gmail.com',
        password:'!@#3e4r5t'
    }).expect(400)
})

test('should get profile for user', async () =>{
    await request(app)
    .get('/users/me')
    .set('Authorization',`Bearer ${userone.tokens[0].token}`)
    .send()
    .expect(200)


})

test('should not get profile for nonAuthorization user', async () =>{
    await request(app)
    .get('/users/me')
    .send()
    .expect(404)
})

test('should delete account for user', async () =>{
  const res = await request(app)
    .delete('/users/me')
    .set('Authorization',`Bearer ${userone.tokens[0].token}`)
    .send()
    .expect(200)
    const user = await User.findById(userone)
    expect(user).toBeNull()
})

test('should not delete account for nonAuthorization user', async () =>{
    await request(app)
    .delete('/users/me')
    .send()
    .expect(404)
})