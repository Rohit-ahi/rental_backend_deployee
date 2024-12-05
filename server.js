
const express = require('express')
const cors = require('cors')
const fileupload = require('express-fileupload')
const path = require('path')

require('dotenv').config()

const basicrouter = require('./routers/basicrouter')
const authrouter = require('./routers/authrouter')

const server = express()
server.use(express.urlencoded({extended:true}))
server.use(express.json())
server.use('/vm', express.static(path.join(__dirname, 'uploads/vm')));

server.set('view engine','ejs')

const corsoption = {
       origin:'https://rohitahirwar.info',
       credentials: true
}

server.use(cors(corsoption))
server.use(fileupload())

server.use('/rental',basicrouter)
server.use('/auth',authrouter)

server.use('/verify/:token',(req,res)=>{
       const token = req.params.token
       res.render('email_verification',{token})
})
 
server.use((req,res)=>{
       res.json('Wrong URL')
})

const port = process.env.port || 8080

server.listen(port,()=>{
       console.log(`server is running hello rohit ${port}`)
})