const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
require('mongoose')

const app = express()
//const port = process.env.PORT
const port = 3000


app.use(express.json())
app.use(userRouter)
app.use(taskRouter)




//listen to the server
app.listen(port, () =>{
    console.log('server in up on port ' + port)
})


