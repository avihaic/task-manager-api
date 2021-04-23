const app = require('./app')
const port = process.env.PORT

//listen to the server
app.listen(port, () =>{
    console.log('server in up on port ' + port)
})


