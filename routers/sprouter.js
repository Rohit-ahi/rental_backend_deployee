
const ApiResponse = require('./apiresponse')
const router = require('express').Router()
const {ServiceProvider, sequelize} = require('../models')
const {Vehicles} = require('../models')
const {VehicleMaster} = require('../models')
const {VehicleRequest} = require('../models')


router.use((request,response,next)=>
        {
            const role = request.userinfo.role;
            if(role ==='service_provider')
                next()
            else {
                response.json(new ApiResponse(false,"UnAuthorized Access !"))
            } 

          })


 router.get('/splist',async(req,res)=>{
        try {
            const data = await ServiceProvider.findAll({
                include : "userrec",
                attributes : {
                    exclude : ['user']
                }
            })
            res.json(data)   
        } catch (error) {
                return res.json(new ApiResponse(false,'Failed fetching data'))
           }
       })

    
 router.post('/vehiclesave',async(req,res)=>{   
       try {
               const provider = req.userinfo.id;
               const { master, ...vehicleData } = req.body;
               const newvehicle = {
                   ...vehicleData,
                   provider, 
                   master   
            };
            await Vehicles.create(newvehicle)
            return res.json(new ApiResponse(true,'Data Save successfully'))

        } catch (error) {
            console.error('error***', error)
            return res.json(new ApiResponse(false,'failed vehicle save'))
        }
})


 router.get('/vehiclelist',async(req,res)=>{
             
       const spid = req.userinfo.id
       try {
            vehcilelist = await Vehicles.findAll({where:{provider:spid},
                include : ['user','veh_master'],
                attributes : {
                     exclude : ['provider','master']
                 }
            })

            if(!vehcilelist){
                return res.json(new ApiResponse(false,'Vehicle Not add Yet'))
            }
            res.json(vehcilelist)  

       } catch (error) {
           console.error('error fethcing vehicles')
           return res.json(new ApiResponse(false,'internal Server error',error))
       }
 })

 

 router.delete('/vehicledel/:vid', async(req,res)=>{

        try {
            const { vid} = req.params;     
            const vehicle = await Vehicles.findOne({where:{id:vid}})
            if(!vehicle) {
               return res.status(401).json(new ApiResponse(false,'Vehicle Not Found'))
            }
             await Vehicles.destroy({ where: { id: vid }} );     
             return res.status(200).json({ status: true, msg: 'Successfully delete vehicle' });
    
        } catch (error) {
            return console.error('server error')
        }
    })


 router.get('/list_vm',async(req,res)=>{
     try {
         const list = await VehicleMaster.findAll()
         res.json(list)
     } catch (error) {
         console.error('error:',error)
     }
})


module.exports = router

