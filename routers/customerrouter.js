


const ApiResponse = require('./apiresponse');
const router = require('express').Router()
const{Vehicles} = require('../models');
const {VehicleRequest}=require('../models')

router.use((req,res,next)=>{
        const role = req.userinfo.role;
        if(role ==='customer')
                next()
        else {
             return res.json(new ApiResponse(false,'AnAuthaurized Access'))
        }
})


router.get('/vm_list',async(req,res)=>{
        try {
                const data = await Vehicles.findAll({
                include : ['user','veh_master'],
                attributes : {
                    exclude : ['provider','master']
                }
            })
            res.json(data)  
    
           } catch (error) {
              return  console.error('error fethcing vehicles')
           }
       })


router.post('/vehicle-booking',async (req,res)=> {  
        try{
              customer = req.userinfo.id
              const {...data} = req.body;
              const bookingdata = {
                   customer ,
                   ...data
              }

              if(!bookingdata.vmaster){
                 return res.json(new ApiResponse(false,'Vmaster Not Exist'))
              }
              if(!bookingdata.customer){
                return res.json(new ApiResponse(false,'User Not Exist'))
             }
              await VehicleRequest.create({...bookingdata ,status:false}) 
              res.status(201).json(new ApiResponse(true,'Booking successfully'))
              
        }catch(error) {
            return  res.status(501).json(new ApiResponse(false,'Booking Failed '))
        }     
})

router.get('/booking-history',async(req,res)=>{
                const custid =  req.userinfo.id
        try {
                const data = await VehicleRequest.findAll( {where:{customer:custid},
                        include:["user","vm"],
                        attributes : {
                          exclude:['customer','vmaster']
                        }
                    })
                if(data.length > 0) {
                        res.json(data) 
                } else {
                     return res.json(new ApiResponse(false,"No Booking Yet"))
                }

        } catch (error) {
           return res.json(new ApiResponse(false,'Server Not Connect'))
        }
})

module.exports = router