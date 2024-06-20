const pool = require('../config/db')
const asyncHandler = require('../middleware/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')


// create diary book 
exports.create = asyncHandler(async (req, res, next) => {
    const {title, descr} = req.body
    let  fileName = null
    if(req.file){
        fileName = 'uploads/' + req.file.filename
    } 
    if(!title || !descr){
        return next(new ErrorResponse('sarlavha va tarif bosh qolmasligi kerak', 403))
    }
    const diarybook = await pool.query(`INSERT INTO diarybooks (title, descr, imageUrl, userId) 
        VALUES($1, $2, $3, $4)
        RETURNING * 
        `, [title, descr, fileName, req.user.id])
    return res.status(200).json({
        success: true, 
        data: diarybook.rows[0]
    })     
})

// get one user's diarybook 
exports.getDiarybook = asyncHandler(async (req, res, next) => {
    const diarybooks = await pool.query(`SELECT * FROM diarybooks WHERE userId = $1`, [req.user.id])
    return res.status(200).json({
        success: true,
        data: diarybooks.rows
    })
}) 

// get all diarybook 
exports.getAllDiarybook = asyncHandler(async (req, res, next) => {
    const diarybooks = await pool.query(`SELECT * FROM diarybooks`)
    return res.status(200).json({
        success: true,
        data: diarybooks.rows
    })
}) 

// update diarybook 
exports.update = asyncHandler(async (req, res, next) => {
    const { title, descr } = req.body;
    if (!title || !descr) {
        return next(new ErrorResponse('Sorovlarning barchasi to\'ldirilishi shart', 403));
    }

    const diarybook = await pool.query(`SELECT * FROM diarybooks WHERE id = $1 AND userId = $2`, [req.params.id, req.user.id]);
    if (!diarybook.rows[0]) {
        return next(new ErrorResponse('serverda xatolik kundalik  topilmadi', 403));
    }

    const updateDiarybook = await pool.query(`
        UPDATE diarybooks SET title = $1, descr = $2 WHERE id = $3
        RETURNING * 
    `, [title, descr, req.params.id]);

    return res.status(200).json({
        success: true,
        data: updateDiarybook.rows[0]
    });
});
// delete diarybook 
exports.deleteDiarybook = asyncHandler(async (req, res, next) => {
    const diarybook = await pool.query(`DELETE FROM diarybooks WHERE id = $1`, [req.params.id])
    if (!diarybook.rowCount) {
        return next(new ErrorResponse('serverda xatolik kundalik ochirilmadi', 403));
    } 
    return res.status(200).json({
        success: true, 
        data: "Delete"
    })
})

// get diarynbook by id 
exports.getById = asyncHandler(async (req, res, next) => {
    const diarybook = await pool.query(`SELECT title, imageUrl, descr FROM diarybooks
    WHERE id = $1
        `, [req.params.id])
    if(!diarybook.rows[0]){
        return next(new ErrorResponse('serverda xatolik kundalik  topilmadi', 403));        
    }
    return res.status(200).json({
        success: true, 
        data: diarybook.rows[0]
    })
})