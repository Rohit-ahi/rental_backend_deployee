
const nodemailer = require('nodemailer')
require('dotenv').config()

const email_varify = async(email,emailbody,emailtitle)=>{
    try {

        const transporter = nodemailer.createTransport({
            service:'Gmail',
            pool:true,
            auth:{
               user: process.env.user_mail,
               pass : process.env.app_password
            }
         })

         await transporter.verify();
         const mailOption = {
             from: process.env.user_mail, 
             to:email ,
             subject : emailtitle,
             html : emailbody
         }
         await transporter.sendMail(mailOption)

    } catch (error) {
       console.error('Error sending email:', error);
       throw error 
    }
}

module.exports = {email_varify}