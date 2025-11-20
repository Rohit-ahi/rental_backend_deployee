const router = require("express").Router();
const { User, ServiceProvider, sequelize } = require("../models");
const ApiResponse = require("./apiresponse");
const { generatetoken, tokenvarify } = require("../config/jwtconfig");
const { bcrypt_pass, compare_pass } = require("../config/password");
const { htmlfun, htmlfun2 } = require("../config/emaildesign");
const { email_varify } = require("../config/emailvarify");



router.post("/sp_reg", async (req, res) => {
  const t = await sequelize.transaction();

  try {

    const reqdata = req.body;
    const { name, phone, email} = reqdata;
    
    const[emailexist,phoneexist] = await Promise.all([
        User.findOne({where :{email}}),
        User.findOne({where :{phone}})
    ])
    if (emailexist && phoneexist) {
      return res.status(400).json(new ApiResponse(false, "User Already Exists"));
    } else if (emailexist) {
      return res.status(400).json(new ApiResponse(false, "Email Already Exists"));
    } else if (phoneexist) {
      return res.status(400).json(new ApiResponse(false, "Mobile Number Already Exists"));
    }
    
    const userdata = {
      name,
      phone,
      email,
      role: "service_provider",
      status: false,
    };
    const user = await User.create(userdata, { transaction: t });
    const { company_name, address, contact, reg_number, contact_person } = reqdata;
    const spdata = {
      company_name,
      address,
      contact,
      reg_number,
      contact_person,
      user: user.id,
    };
     await ServiceProvider.create(spdata, { transaction: t });
     const token = generatetoken(user.id,user.role)
     await t.commit();
     res.json(new ApiResponse(true, "Registration Successfully. Please verify your email."));

     const html1 = htmlfun(name,token)
     try {
        await email_varify(email ,html1,'Welcome to Rento')
     } catch (error) {
        console.error('error',error)
     }
     
  } catch (error) {
    await t.rollback();
    return res.json(new ApiResponse(false, "Ragistration Failed"));
  }
});


  router.post("/cust_reg", async(req, res) => {
        const { name ,phone,email } = req.body;
  
        const [emailexist, phoneexist] = await Promise.all([
        User.findOne({ where: { email } }),
        User.findOne({ where: { phone } })
        ]);
        if (emailexist && phoneexist) {
            return res.status(400).json(new ApiResponse(false, "User Already Exists"));
        } else if (emailexist) {
            return res.status(400).json(new ApiResponse(false, "Email Already Exists"));
        }     else if (phoneexist) {
            return res.status(400).json(new ApiResponse(false, "Mobile Number Already Exists"));
        }
      const t = await sequelize.transaction()
    try {     
        const userdata = {name,phone,email,role:'customer',status:false}
        const user = await User.create(userdata,{transaction:t})
        const token = generatetoken(user.id,user.role)
        await t.commit()
        
        res.status(200).json(new ApiResponse(true,"Registration Successfully. Please verify your email."))

        const html2 = htmlfun2(name,token)
        try {
           await email_varify(email,html2,'Welcome to Rento')
        }catch (error) {
           console.error('error',error)
        }
    }catch (error) {
     await t.rollback()
     console.error('error :',error.message)
     return res.json(new ApiResponse(false, "Registration Failed"));
    }

  });


    router.put('/email_verify/:token',async(req,res)=>{
        try {
            
            const token = req.params.token
            if(!token) {
               return res.json(new ApiResponse(false,'Anauthorized Access'))
            }
            tokenvarify(token,async(err,tokendata)=>{
                if(err) {
                  return  res.json(new ApiResponse(false,'Expire Or Invalid Token'))
                }
                const userid = tokendata.userid
                const {password} = req.body
                
                const hashpass = await bcrypt_pass(password)
                const user = await User.findOne({where:{id:userid}})
                if(!user) {
                    return res.json(new ApiResponse(false,'Invalid User'))
                }
                if(user.status) {
                  return res.json(new ApiResponse(false,'User is already Registered and Verify'))
                }
                const userdata = {password :hashpass,status:true}
                await user.update(userdata)
                return res.json(new ApiResponse(true,'Email verified successfully'))
            })

        } catch (error) {
            console.error('error',error)
            res.json(new ApiResponse(false,'Failed Email verification. please try again'))
        }   
    })



router.post("/login", async (req, res) => {
          
  try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: {email} });
      if (!user) {
          return res.status(401).json(new ApiResponse(false, "Invalid User"));
      }
      const check_pass = await compare_pass(password,user.password)
      if(!check_pass) {
         return res.status(401).json(new ApiResponse(false, "Incorrect Password"));
      }
      if(user.status)  {
        const token = generatetoken(user.id, user.role);
        const role = user.role;
        return res.status(200).json(new ApiResponse(true, "Correct id and Password", {token , role}));
      }else {
         return res.json(new ApiResponse(false,'Account is not Activated'))
      }

  } catch (error) {
      console.error('error',error)
      return res.json(new ApiResponse(false,'Network Error'))
  }

});


module.exports = router;
 