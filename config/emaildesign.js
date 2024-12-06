


function htmlfun(name,token) {
    if(!(token && name)) {
        throw new Error("Name is missing!");
     }
    return ` 
             
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Responsive Email</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
    <tr>
      <td align="center" style="background-color: #007bff; padding: 20px;">
        <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Welcome, Service Provider!</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; text-align: center;">
        <h2 style="color: #333; font-size: 20px; margin: 10px 0;">Hello, ${name}</h2>
        <p style="color: #666; font-size: 16px; margin: 10px 0; line-height: 1.5;">
          Thank you for joining Rento Vehicle as a Service Provider. Please verify your email to activate your account.
        </p>
        <a href="https://rental-backend-deployee.onrender.com/verify/${token}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px;">
          Activate Your Account
        </a>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f4f4f4; padding: 10px; text-align: center; color: #999; font-size: 14px;">
        <p style="margin: 0;">© 2024 Rento Vehicle, Inc. All rights reserved.</p>
        <p style="margin: 5px 0;">
          <a href="https://yourwebsite.com/unsubscribe" style="color: #007bff; text-decoration: none;">Unsubscribe</a> |
          <a href="https://yourwebsite.com/support" style="color: #007bff; text-decoration: none;">Contact Support</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>

  `
  }
  
  function htmlfun2(name,token) {
     if(!(token && name)) {
        throw new Error("Name is missing!");
     }
   return `
               
   <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Email</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          <tr>
              <td align="center" bgcolor="#ff0000" style="padding: 20px 0;">
                  <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Email Verification!</h1>
              </td>
          </tr>
          
          <tr>
              <td style="padding: 20px; text-align: center;">
                  <h2 style="color: #333; font-size: 20px;">Hello, ${name}</h2>
                  <p style="color: #666; font-size: 16px; line-height: 1.5;">
                      Please Verify your Email through given verification link.
                  </p>
                  <p style="color: #666; font-size: 16px; line-height: 1.5;">
                     <a href="https://rental-backend-deployee.onrender.com/verify/${token}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: rgb(255, 0, 0); color: #ffffff; text-decoration: none; border-radius: 5px;">Verify</a>
                  </p>
              </td>
          </tr>
          
          <tr>
              <td style="background-color: #f4f4f4; padding: 10px; text-align: center; color: #999; font-size: 14px;">
                  <p>© 2024 Rento vehicle, Inc. All rights reserved.</p>
                  <p><a href="https://yourwebsite.com/unsubscribe" style="color: #007bff; text-decoration: none;">Unsubscribe</a></p>
              </td>
          </tr>
      </table>
  </body>
  </html>
  `
  }
  module.exports = {htmlfun2 ,htmlfun}



 
