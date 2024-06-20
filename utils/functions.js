const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// prolni hash qilish 
exports.hashedPassword = async function(password){
    return await bcrypt.hash(password, 10)
}

// parolni mosligini tekshirish 
exports.matchPassword = async function(password, truePassword){
    return await bcrypt.compare(password, truePassword)
}

// token genarate
exports.genarateToken = function(user){
    return jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE})
}
