
const express = require('express')
const cors = require('cors')
const fileupload = require('express-fileupload')
const path = require('path')
const cloudinary = require('cloudinary').v2

require('dotenv').config()

const basicrouter = require('./routers/basicrouter')
const authrouter = require('./routers/authrouter')

const server = express()
server.use(express.urlencoded({extended:true}))
server.use(express.json())
server.use('/vm', express.static(path.join(__dirname, 'uploads/vm')));

server.set('view engine','ejs')

const corsoption = {
       origin:'https://rohitahirwar.online',
       credentials: true
}
server.use(cors(corsoption))

cloudinary.config({

       cloud_name: process.env.CLOUD_NAME,
       api_key: process.env.CLOUD_API_KEY,
       api_secret: process.env.CLOUD_API_SECRET,
});

server.use(fileupload({
       useTempFiles: true,
       tempFileDir: '/tmp/'
}))

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
