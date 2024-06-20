const { Router } = require('express')
const router = Router()


const { protect } = require('../middleware/auth')

const { 
    create,
    getAllCommit,
    update,
    deleteCommit
} = require('../controller/commit.controller')

router.post('/create/:id', protect, create)
router.get('/get/:id', protect, getAllCommit)
router.put('/update/:id', protect, update)
router.delete('/delete/:id', protect, deleteCommit)

module.exports = router
