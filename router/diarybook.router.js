const { Router } = require('express')
const router = Router()


const { protect } = require('../middleware/auth')

const { 
    create,
    getDiarybook,
    getAllDiarybook,
    update,
    deleteDiarybook,
    getById
} = require('../controller/diarybook.controller')

const upload = require('../utils/fileUploads')

router.post('/create', protect, upload.single('imageurl'), create)
router.get('/get', protect, getDiarybook)
router.get('/get/all', protect, getAllDiarybook)
router.put('/update/:id', protect, update)
router.delete('/delete/:id', protect, deleteDiarybook)
router.get('/get/:id', protect, getById)

module.exports = router
