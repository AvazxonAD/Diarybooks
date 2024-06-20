const pool = require("../config/db");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

// create commit 
exports.create = asyncHandler(async (req, res, next) => {
    const diarybook = await pool.query(`SELECT * FROM diarybooks WHERE id = $1
        `, [req.params.id])
    if(!diarybook.rows[0]){
        return next(new ErrorResponse ('server xatolik kundalik topilmadi', 403))
    }
    const {commit} = req.body
    if(!commit){
        return next(new ErrorResponse('sorovlar bosh qolishi mumkin emas', 403))
    }
    const newCommit = await pool.query(`INSERT INTO commits(commit, bookId, userId) VALUES($1, $2, $3) RETURNING * 
        `, [commit, req.params.id, req.user.id])
    return res.status(201).json({
        success: true,
        data: newCommit.rows[0]
    })
})

// get all commit 
exports.getAllCommit = asyncHandler(async (req, res, next) => {
    const commits = await pool.query(`SELECT username, email, commit FROM commits 
        JOIN users ON commits.userId = users.id
        where commits.bookId = $1
        `, [req.params.id])
    return res.status(200).json({
        success: true, 
        data: commits.rows
    })
})

// update commit 
exports.update = asyncHandler(async (req, res, next) => {
    if(!req.body.commit){
        return next(new ErrorResponse('sorovlar bosh qolishi mumkin emas', 403))
    }
    const commit = await pool.query(`SELECT *  FROM commits WHERE id = $1 AND userId = $2 
        `, [req.params.id, req.user.id])
    if(!commit.rows[0]){
        return next(new ErrorResponse(' server xatolik comentariya topilmadi', 500))
    }
    const updateCommit = await pool.query(`UPDATE commits SET commit = $1 WHERE id = $2 AND userId = $3 
        RETURNING commit
        `, [req.body.commit, req.params.id, req.user.id])
    return res.status(200).json({
        success: true,
        data: updateCommit.rows[0] 
    })
})

// delete commit 
exports.deleteCommit = asyncHandler(async (req, res, next) => {
    const commit = await pool.query(`SELECT * FROM commits WHERE id = $1`, [req.params.id])
    const diarybook = await pool.query(`SELECT userid FROM diarybooks WHERE id = $1`, [commit.rows[0].bookid])
    if(diarybook.rows[0].userid === req.user.id){
        await pool.query(`DELETE FROM commits WHERE id = $1`, [req.params.id])
        return res.status(200).json({
            sucess: true,
            data: "Delete"
        })
    }
    const deleteCommit = await pool.query(`DELETE FROM commits WHERE id = $1 AND userid = $2`, [req.params.id, req.user.id])
    if(!deleteCommit.rowCount){
        return next(new ErrorResponse(`server xatolik malumot ochirilmadi`, 500))
    }
    return res.status(200).json({
        success: true,
        data: "Delete"
    })
})