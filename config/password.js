


const bcrypt = require('bcrypt')

const bcrypt_pass = async(password)=>{
    try {
        const saltRounds = 10
        const hash = await bcrypt.hash(password,saltRounds)
        return hash

    } catch (error) {
       throw error 
    }
}

const compare_pass = async(password,hashpass)=>{
    try {
        const check = await bcrypt.compare(password,hashpass)
        return check
    } catch (error) {
       throw error 
    }
}


module.exports = {bcrypt_pass,compare_pass}