const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
require('mongoose')

const app = express()
const port = process.env.PORT


app.use(express.json())
app.use(userRouter)
app.use(taskRouter)




//listen to the server
app.listen(port, () =>{
    console.log('server in up on port ' + port)
})

/* const Task = require('./models/Task')
const User = require('./models/user')
const main = async () => {
   const task = await Task.findById('6037a009a665230020480d78')
   await task.populate('owner').execPopulate()
   console.log(task.owner)

    const user = await User.findById('60379c108beaf23940d719e3')
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)

}

main() */
