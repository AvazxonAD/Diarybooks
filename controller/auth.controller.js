const asyncHandler = require('../middleware/asyncHandler')
const pool = require('../config/db')
const ErrorResponse = require('../utils/errorResponse')
const redis = require('redis')

const {
    matchPassword, 
    genarateToken,
    hashedPassword,
} = require('../utils/functions')

// register page 
exports.register = asyncHandler(async (req, res, next) => {
    const {username, password, email} = req.body
    if(!username || !password ||!email){
        return next(new ErrorResponse('sorovlar bosh qolishi mumkin emas', 403))
    }  
    // const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    // if( !isEmail){
    //     return next(new ErrorResponse(`email formati notog'ri ${email}`, 403))
    // }
    const test = await pool.query('SELECT email FROM users WHERE email = $1', [email])
    if( test.rows[0]){
        return next(new ErrorResponse(`bu email orqali allaqachon royhatdan otilgan ${email}`, 403))
    }
    // if(password.length < 8){
    //     return next(new ErrorResponse('password juda passiv iltimos kuchliroq password qoying'))
    // }
    const hashedParol = await hashedPassword(password)
    const newUser = await pool.query(`INSERT INTO 
        users(username, email, password)
        VALUES($1, $2, $3) 
        RETURNING *
        `, [username, email, hashedParol])
    return res.status(200).json({
        success: true, 
        data: newUser.rows
    })
})

// login 
exports.login = asyncHandler(async (req, res, next) => {
    const {email, password} = req.body
    if(!email || !password){
        return next(new ErrorResponse('sorovlar bosh qolmasligi kerak', 403))
    }
    const user = await pool.query(`SELECT * FROM users WHERE email = $1`, [email])
    if(!user.rows[0]){
        return next(new ErrorResponse('Email yoki parol notogri kiritildi', 404))
    }
    const match = await matchPassword(password, user.rows[0].password)
    if(!match){
        return next(new ErrorResponse('Email yoki parol notogri kiritildi', 404))
    }
    const token = genarateToken(user.rows[0])
    return res.status(200).json({
        success: true, 
        data : user.rows[0],
        token
    })
})

//  get profile 
exports.getProfile = asyncHandler(async (req, res, next) => {
    const userId = req.user.id
    const client = redis.createClient({
        host: '127.0.0.1',
        port: 6379
    })
    client.on('connect', () => {
        console.log('Redis serverga muvaffaqiyatli ulanildi');
    });
    
    client.on('error', (err) => {
        console.error('Redis xatosi:', err);
    });

    await client.connect()
    const redisUser = await client.get(`user:${req.user.id}`)
    if(redisUser){
        await client.disconnect()
        return res.status(200).json({
            success: true, 
            data: JSON.parse(redisUser)
        })    
    }
    const user = await pool.query('SELECT username, email FROM users WHERE id = $1', [req.user.id])
    await client.set(`user:${userId}`, JSON.stringify(user.rows[0]))
    await client.disconnect()
    if(!user.rows[0]){
        return next(new ErrorResponse('user topilmadi server xatolik', 403))
    }

    return res.status(200).json({
        success: true, 
        data: user.rows[0]
    })
})

// update password 
exports.updatePasword = asyncHandler(async (req, res, next) => {
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id])
    const { oldPassword, newPassword } = req.body
    if(!oldPassword || !newPassword){
        return next(new ErrorResponse('sorovlar bosh qolmasligi kerak', 403)) 
    }
    const match = await matchPassword(oldPassword, user.rows[0].password)
    if(!match){
        return next(new ErrorResponse('parol notogri kiritildi', 404))
    }   
    // if(newPassword.length < 8){
    //     return next(new ErrorResponse('password juda passiv iltimos kuchliroq password qoying'))
    // }
    const hashedParol = await hashedPassword(newPassword)
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedParol, req.user.id])
    
    return res.status(200).json({
        success: true,
        data: 'parol muvaffiqiyatli ozgardi'
    })
})

// update user 
exports.updateUser = asyncHandler(async (req, res, next) => {
    const {email, username} = req.body
    if(!email || !username){
        return next(new ErrorResponse('sorovlar bosh qolmasligi kerak', 403))
    }
    const oldUser = await pool.query(`SELECT email FROM users WHERE id = $1`, [req.user.id]) 
    if(!oldUser.rows[0]){
        return next(new ErrorResponse('server xatolik user topilmadi', 500))
    }
    if(oldUser.rows[0].email !== email){
        const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
        if( !isEmail){
            return next(new ErrorResponse(`email formati notog'ri ${email}`, 403))
        }
        const test = await pool.query(`SELECT email FROM users WHERE email = $1`, [email])
        if(test.rows[0]){
            return next(new ErrorResponse(`bu emaildan foydalana olmaysiz u allaqachon mavjud : ${email}`))
        }
    }
    const user = await pool.query(`UPDATE users 
        SET email = $1, username = $2 WHERE id = $3
        RETURNING username, email
        `, [email, username, req.user.id])
    return res.status(200).json({
        success: true, 
        data: user.rows[0]
    })
})
