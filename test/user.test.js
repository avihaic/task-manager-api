const { TestScheduler } = require('@jest/core')
const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')

const userone = {
    name:'gal1',
    email:'gal1@gmail.com',
    password:'12345678'
}

beforeEach(async () => {
await User.deleteMany()
await new User(userone).save()
})

test('should singup a new user', async () =>{
    await request(app).post('/users').send({
        name:'mor',
        email:'mor@gmail.com',
        password:'12345678'
    }).expect(200)
})

test('should login user', async () =>{
    await request(app).post('/users/login').send({
        email:userone.email,
        password:userone.password
    }).expect(200)
})

test('should not login nonexistent user', async () =>{
    await request(app).post('/users/login').send({
        email:'AAAAAA@GMAIL.COM',
        password:'WRWRVWVVWV'
    }).expect(400)
})