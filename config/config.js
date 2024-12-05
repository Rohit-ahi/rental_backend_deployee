

require('dotenv').config()

 module.exports = {

  development : {

    username: process.env.db_username,
    password: process.env.db_password,
    database: process.env.db_name,
    host: process.env.db_host,
    dialect: process.env.db_dialect 
  },

  

  production: {
       
    username: process.env.db_username,
    password: process.env.db_password,
    database: process.env.db_name,
    host: process.env.db_host,
    dialect: process.env.db_dialect 
  }

}

 