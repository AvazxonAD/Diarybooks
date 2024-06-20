const { Router } = require('express')
const router = Router()


const { protect } = require('../middleware/auth')

const { 
    register,
    login,
    getProfile,
    updatePasword,
    updateUser
} = require('../controller/auth.controller')

router.post('/register', register)
router.post('/login', login)
router.get('/get', protect, getProfile)
router.put('/update/user', protect, updateUser)
router.put('/update/password', protect, updatePasword)

module.exports = router
