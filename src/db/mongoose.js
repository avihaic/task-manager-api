const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://taskApp:avihaic524310@cluster0.kfuwr.mongodb.net/task-manager-api?retryWrites=true',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true
})



