const mongoose = require('mongoose')

/* mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api",{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true
}) */

mongoose.connect("mongodb+srv://taskApp:avihaic524310@cluster0.kfuwr.mongodb.net/task-manager-api?retryWrites=true",{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true
})


