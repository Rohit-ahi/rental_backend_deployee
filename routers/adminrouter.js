
router = require('express').Router()

const ApiResponse = require('./apiresponse')
const path = require('path')
const {v4:uuidv4} = require('uuid')
const {VehicleMaster, sequelize} = require('../models')
const { response } = require('express');
const {Vehicles} = require('../models');
const {User, ServiceProvider} = require('../models')
const{ VehicleRequest} = require('../models')
const fs = require('fs')
const cloudinary = require('cloudinary').v2;



router.use((req,res,next)=>{
     const role = req.userinfo.role

    if(role == "admin")
          next()
    else {
            res.json(new ApiResponse(false,"UnAuthaurized Access"))
       }
    })
    
    
router.get('/userlist', async(req,res)=>{   
    try {
        const data = await User.findAll()
        res.json(data)
    } catch (error) {
        console.error('error',error)
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
        console.error("error :",error)
      }
})


router.post('/save_vm',async(req,res)=>{
         
      const reqdata = req.body 
      const {model} = reqdata
      const vmmodal = await VehicleMaster.findOne({where:{model:model}})
      if(vmmodal) {
         return res.json(new ApiResponse(false,'Modal name must be Unique'))
      }
      const t = await sequelize.transaction() 
      
    try {
        const file = req.files?.image;
        if (!file) {
            return res.status(400).json(new ApiResponse(false, 'Image file is required'));
        }
        const cloudinaryResult = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: 'rental_images', 
            public_id: uuidv4(),    
        });

        const finaldata = { ...reqdata, image: cloudinaryResult.secure_url };
        await VehicleMaster.create(finaldata, { transaction: t });
        await t.commit();
        return res.status(200).json(new ApiResponse(true, 'Saved VehicleMaster'))

       } catch (error) {
            await t.rollback();
            if (error.public_id) {
                await cloudinary.uploader.destroy(error.public_id);
            }
          console.error('error :' , error)
          return  res.json(new ApiResponse(false,"Failed to Save VehicleMaster"))
        }
    })


    router.get('/list_vm',async(req,res)=>{
          try {
            const list = await VehicleMaster.findAll()
            res.json(list)
          } catch (error) {
              console.error('error :',error)
          }
           
    })


    router.get('/vehiclelist',async(req,res)=>{         
       try {
            const data = await Vehicles.findAll({
            include : ['user','veh_master'],
            attributes : {
                exclude : ['provider','master']
            }
        })
        res.json(data)  

       } catch (error) {
             console.error('error fethcing vehicles',error) 
       }
    })


    router.delete('/del_vm/:vmid', async(req,res)=>{
             
      const {vmid } = req.params;     
      const t = await sequelize.transaction() 

     try {
            const vehicles = await Vehicles.findOne({ where: { master: vmid } });
            const bookedvm = await VehicleRequest.findOne({where:{vmaster:vmid}})

        if(bookedvm){
           return res.json(new ApiResponse(false,"Booked_Vehicle can't deleted"))
        } else{
                if(vehicles){ 

                const vehicleDeleteResult = await Vehicles.destroy({ where: { master: vmid }} , { transaction: t } );
                if (!vehicleDeleteResult) {
                       throw new Error('Vehicle not found or could not be deleted');  
                    }
                }
               const vehicleMasterDeleteResult = await VehicleMaster.destroy({where: { id: vmid }}, { transaction: t });
                if (!vehicleMasterDeleteResult) {
                     throw new Error('VehicleMaster not found or could not be deleted');
                }
            }
                 await t.commit();
                 return res.status(200).json(new ApiResponse(true,'Vehicle and VehicleMaster deleted successfully') );

     } catch (error) {
        await t.rollback();
        return res.status(500).json(new ApiResponse(false,'Failed Operation'));
     }

 })
 

 router.delete('/userdel/:uid', async(req,res)=>{

        const {uid} = req.params
        const user = await User.findOne({where: {id:uid}})
          
        if (!user) {
            return res.status(404).json({ status: false, msg: 'User not found' });
        }

        if(user.role!=='service_provider') {
           
                     if(user.role=='admin') {
                        return  res.json(new ApiResponse(false,"Admin can't be deleted"))
                     }else {

                          const bookuser = await VehicleRequest.findOne({where:{customer:uid}})
                          if(bookuser) {
                              res.json(new ApiResponse(false,"Booked User can't be deleted"))
                          }else {
                            await user.destroy()
                            res.json(new ApiResponse(true,'Customer Deleted Successfully'))
                          }  
                    }     
           }else {
             const t = await sequelize.transaction() 
          try { 
                const vehicles = await Vehicles.findOne({ where: { provider: uid } });
                if(vehicles) {
                    const VDeleteResult = await Vehicles.destroy({ where: { provider:uid  }} , { transaction: t } );
                    if (!VDeleteResult) {
                              throw new Error('vehicle not found or could not be deleted');
                           }
                }
            const spDeleteResult = await ServiceProvider.destroy({ where: { user:uid  }} , { transaction: t } );
              if (!spDeleteResult) {
                    throw new Error('ServiceProvider not found or could not be deleted');           
                }
    
             const UserDeleteResult = await User.destroy({where: { id: uid }}, { transaction: t });
             if (!UserDeleteResult) {
                      throw new Error('User not found or could not be deleted');
                  }
       
                await t.commit();
                return res.status(200).json({ status: true, msg: 'User and  Service_Provider Deleted successfully' });

      } catch (error) {
             console.error("Error in Transaction: ", error);
            await t.rollback();
            return res.status(500).json({ status: false, msg:'operation failed' });
          }

    }
})


router.delete('/vehicledel/:vid', async(req,res)=>{

    const vid = req.params.vid
     try {
           const vehicle = await Vehicles.findOne({where: {id:vid}})
           if(vehicle==null) {
                res.json(new ApiResponse(false,'Vehicle Not Found'))
           }else {
                await vehicle.destroy()
                res.json(new ApiResponse(true,'Vehicle Successfully Deleted'))
        }
     } catch (error) {
           res.json(new ApiResponse(false,'Server error'))
     }
})



router.put('/update_vm/:id', async (req, res) => {

        const t = await sequelize.transaction(); 
        const vmid = req.params.id; 
        const reqdata = req.body;

    try {
           const vmaster = await VehicleMaster.findOne({ where: { id: vmid } });
           if (!vmaster) {
               return res.json(new ApiResponse(false, 'VehicleMaster not found'));
            }

        let imagepath = null
        if(req.files && req.files.image) {

            const file = req.files.image;

             cloudinaryResult = await cloudinary.uploader.upload(file.tempFilePath,{
                 folder: 'rental_images',
                 public_id : uuidv4()
             })
             
             imagepath = cloudinaryResult.secure_url

            if (vmaster.image) {
                const publicId = vmaster.image.split('/').pop().split('.')[0]; 
                await cloudinary.uploader.destroy(`rental_images/${publicId}`);
            }

         }
        const finaldata = {
            ...reqdata,
            ...(imagepath && { image: imagepath }), 
        };

        await VehicleMaster.update(finaldata, { where: { id: vmid }, transaction: t });
        await t.commit(); 

        return res.json(new ApiResponse(true, 'Updated Successfully'));

    } catch (error) {
        await t.rollback(); 
        console.error('Error:', error);

        return res.json(new ApiResponse(false, 'Failed to Update'));
    }

});

           
module.exports = router